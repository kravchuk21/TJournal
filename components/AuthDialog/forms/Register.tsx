import React from 'react'
import {yupResolver} from '@hookform/resolvers/yup'
import {Button} from '@material-ui/core'
import {FormField} from '../../FormField'
import {FormProvider, useForm} from 'react-hook-form'
import {RegisterFormSchema} from '../../../utils/validations'
import {UserApi} from '../../../utils/api'
import {CreateUserDto} from '../../../utils/api/types'
import {setCookie} from 'nookies'
import Alert from '@material-ui/lab/Alert'
import {setUserData} from '../../../redux/slices/user'
import {useAppDispatch} from '../../../redux/hooks'

interface RegisterFormProps {
    onOpenLogin: () => void;
    onOpenRegister: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({onOpenLogin, onOpenRegister}) => {
    const dispatch = useAppDispatch()
    const [errorMessage, setErrorMessage] = React.useState('')
    const form = useForm({
        mode: 'onChange',
        resolver: yupResolver(RegisterFormSchema),
    })

    const onSubmit = async (dto: CreateUserDto) => {
        try {
            const data = await UserApi.register(dto)
            setCookie(null, 'authToken', 'value', {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
            })
            setErrorMessage('')
            dispatch(setUserData(data))
        } catch (e) {
            console.warn('Ошибка при регистрации', e)
            if (e.response) {
                setErrorMessage(e.response.data.message)
            }
        }
    }

    return (
        <div>
            <FormProvider {...form}>
                <FormField name="fullName" label="Имя и фамилия"/>
                <FormField name="email" label="Почта"/>
                <FormField name="password" label="Пароль"/>
                {errorMessage && <Alert className="mb-20" severity="error">{errorMessage}</Alert>}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="d-flex align-center justify-between">
                        <Button
                            disabled={!form.formState.isValid || form.formState.isSubmitting}
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
