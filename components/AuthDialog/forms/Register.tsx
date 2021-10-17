import React from 'react'
import {yupResolver} from '@hookform/resolvers/yup'
import {Button} from '@material-ui/core'
import {FormField} from '../../FormField'
import {FormProvider, useForm} from 'react-hook-form'
import {RegisterFormSchema} from '../../../utils/validations'

interface RegisterFormProps {
    onOpenLogin: () => void;
    onOpenRegister: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({onOpenLogin, onOpenRegister}) => {
    const form = useForm({
        mode: 'onChange',
        resolver: yupResolver(RegisterFormSchema),
    })

    const onSubmit = (data) => console.log(data)

    console.log(form.formState.errors)

    return (
        <div>
            <FormProvider {...form}>
                <FormField name="fullname" label="Имя и фамилия"/>
                <FormField name="email" label="Почта"/>
                <FormField name="password" label="Пароль"/>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="d-flex align-center justify-between">
                        <Button
                            disabled={!form.formState.isValid}
                            onClick={onOpenRegister}
                            type="submit"
                            color="primary"
                            variant="contained"
                        >
                            Зарегистрироваться
                        </Button>
                        <Button onClick={onOpenLogin} color="primary" variant="text">
                            Войти
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default RegisterForm
