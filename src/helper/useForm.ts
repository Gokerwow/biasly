/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export function useForm(initialValues : any) {
    const [values, setValues] = useState(initialValues)

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target
        setValues((prev: any) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    console.log(values)

    const resetForm = () => setValues(initialValues)

    return {
        values,
        handleChange,
        resetForm,
        setValues
    }
}