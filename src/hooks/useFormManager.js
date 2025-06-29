import { useState, useCallback } from 'react';
import { INITIAL_FORM_STATE } from '../constants/appConfig';

export const useFormManager = (initialStateOverrides = {}) => {
    const [formData, setFormData] = useState({
        ...INITIAL_FORM_STATE,
        ...initialStateOverrides
    });
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for the field being changed
        if (formErrors[field]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [formErrors]);

    const resetForm = useCallback((newOverrides = {}) => {
        setFormData({
            ...INITIAL_FORM_STATE,
            ...newOverrides
        });
        setFormErrors({});
    }, []);

    return { formData, setFormData, formErrors, setFormErrors, handleInputChange, resetForm };
};