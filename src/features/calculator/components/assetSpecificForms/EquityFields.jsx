import React from 'react';
import CustomCheckbox from '../../../../components/common/CustomCheckbox';
import FormattedNumberInput from '../../../../components/common/FormattedNumberInput';
import InputError from '../../../../components/common/InputError';

export const EquityFields = ({ formData, onChange, placeholders }) => {
    return (
        <div className="bg-fuchsia-500/10 p-4 rounded-xl border border-fuchsia-400/20">
            <CustomCheckbox
                id="grandfather"
                label="Asset purchased on or before Jan 31, 2018?"
                checked={formData.isGrandfathered}
                onChange={(isChecked) => onChange('isGrandfathered', isChecked)}
                tooltipText="Grandfathering Provision: As per Income Tax Act provisions, assets acquired before Jan 31, 2018 can use their fair market value as of Jan 31, 2018 as the deemed cost of acquisition for calculating capital gains, instead of the original purchase price. This statutory protection helps reduce tax liability on long-held investments.."
            />
            {formData.isGrandfathered && (
                <div className="mt-4 border-t border-fuchsia-400/20 pt-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Fair Market Value on Jan 31, 2018 (per share/unit)<span className="text-red-500 ml-1">*</span></label>
                    <FormattedNumberInput
                        value={formData.fmvOnJan312018}
                        onChange={(value) => onChange('fmvOnJan312018', value)}
                        placeholder={placeholders.fmvOnJan312018}
                    />
                </div>
            )}
        </div>
    );
};