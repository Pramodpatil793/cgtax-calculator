import requests
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import date, timedelta
from io import StringIO
import os

def get_bhavcopy_from_nse(for_date: date):
    """
    Downloads the Bhavcopy CSV by mimicking a browser session.
    """
    base_url = "https://www.nseindia.com/api/reports"
    date_str = for_date.strftime('%d-%m-%Y')
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Referer': 'https://www.nseindia.com/all-reports',
    }
    
    session = requests.Session()
    session.get("https://www.nseindia.com/all-reports", headers=headers, timeout=60) # Increased timeout
    
    params = {
        'name': 'cm-bhavcopy-and-misc',
        'section': 'CM',
        'type': 'equities',
        'category': 'ALL',
        'date': date_str,
        'symbol': '',
        'format': 'csv'
    }
    
    print(f"Requesting data for {date_str}...")
    response = session.get(base_url, headers=headers, params=params, timeout=60)
    response.raise_for_status()

    if "error" in response.text or not response.text.strip():
        print(f"Soft error or empty response from NSE for {date_str}.")
        return None

    return pd.read_csv(StringIO(response.text))

def update_firestore():
    """Main function to orchestrate the entire process."""
    print("--- Starting Daily Stock Price Update ---")
    
    try:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("--> Firebase app initialized successfully.")
    except Exception as e:
        print(f"!!! CRITICAL ERROR: Could not initialize Firebase. Details: {e}")
        return

    for i in range(1, 6):
        target_date = date.today() - timedelta(days=i)
        if target_date.weekday() >= 5: continue
            
        try:
            print(f"\n>> Attempting to download Bhavcopy for: {target_date.strftime('%d-%m-%Y')}")
            df = get_bhavcopy_from_nse(target_date)
            
            if df is not None and not df.empty:
                print("✅ Bhavcopy downloaded. Processing and updating Firestore...")
                df.columns = [c.strip() for c in df.columns]
                
                batch = db.batch()
                count = 0
                for _, row in df.iterrows():
                    if 'SERIES' in row and row['SERIES'] == 'EQ':
                        symbol = row['SYMBOL']
                        close_price = row['CLOSE_PRICE']
                        ref = db.collection('securities').document(symbol)
                        batch.update(ref, {
                            'previousDayClose': float(close_price),
                            'lastUpdated': firestore.SERVER_TIMESTAMP
                        })
                        count += 1
                
                batch.commit()
                print(f"✅✅✅ Successfully updated {count} stock prices. Process complete.")
                return

        except Exception as e:
            print(f"🟡 An error occurred for {target_date.strftime('%d-%m-%Y')}. Reason: {e}")
            
    print("\n--- Update process finished. Could not find data in the last 5 days. ---")

if __name__ == "__main__":
    update_firestore()