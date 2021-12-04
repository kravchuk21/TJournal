import React from 'react'
import {Button} from '@material-ui/core'
import {FormField} from '../../FormField'
import {FormProvider, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {LoginFormSchema} from '../../../utils/validations'
import {LoginDto} from '../../../utils/api/types'
import {UserApi} from '../../../utils/api'
import {setCookie} from 'nookies'
import Alert from '@material-ui/lab/Alert'
import {useAppDispatch} from '../../../redux/hooks'
import {setUserData} from '../../../redux/slices/user'

interface LoginFormProps {
    onOpenRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onOpenRegister}) => {
    const dispatch = useAppDispatch()
    const [errorMessage, setErrorMessage] = React.useState('')
    const form = useForm({
        mode: 'onChange',
        resolver: yupResolver(LoginFormSchema),
    })

    const onSubmit = async (dto: LoginDto) => {
        try {
            const data = await UserApi.login(dto)
            setCookie(null, 'authToken', 'value', {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
            })
            setErrorMessage('')
            dispatch(setUserData(data))
        } catch (e) {
            console.warn('Ошибка при авторизации', e)
            if (e.response) {
                setErrorMessage(e.response.data.message)
            }
        }
    }

    return (
        <div>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField name="email" label="Почта"/>
                    <FormField name="password" label="Пароль"/>
                    {errorMessage && <Alert className="mb-20" severity="error">{errorMessage}</Alert>}
                    <div className="d-flex align-center justify-between">
                        <Button disabled={!form.formState.isValid} type="submit" color="primary" variant="contained">
                            Войти
                        </Button>
                        <Button onClick={onOpenRegister} color="primary" variant="text">
                            Регистрация
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default LoginForm
