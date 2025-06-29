import React from 'react';
import CustomSelect from '../../../../components/common/CustomSelect';
import InputError from '../../../../components/common/InputError';

export const PreciousMetalsFields = ({ formData, onChange, errors }) => {
    const unitOptions = [
        { value: 'gm', label: 'Per gram (Gold/Platinum)' },
        { value: '10gm', label: 'Per 10 gram (Gold)' },
        { value: 'kg', label: 'Per kilogram (Silver)' },
        { value: 'carat', label: 'Per carat (Diamond)' },
        { value: 'unit', label: 'Per Unit (Generic)' }
    ];

    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Unit of Measurement<span className="text-red-500 ml-1">*</span></label>
            <CustomSelect
                value={formData.measurementUnit}
                onChange={(value) => onChange('measurementUnit', value)}
                options={unitOptions}
                placeholder="Select a unit"
                error={errors.measurementUnit}
            />
            <InputError message={errors.measurementUnit} />
        </div>
    );
};