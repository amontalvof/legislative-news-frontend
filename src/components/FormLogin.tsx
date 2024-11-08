import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { baseApiUrl } from '../constants/data';
import { toast } from 'react-toastify';
import { fetchWithoutToken } from '../helpers/fetch';
import { useAuthStore } from '../global/useAuthStore';
import { useLocation, useNavigate } from 'react-router-dom';

type FormLoginProps = {
    handleClose: () => void;
};

interface IFormValues {
    email: string;
    password: string;
}

const loginFormSchema = z.object({
    email: z.string().email("Email isn't valid"),
    password: z
        .string()
        .min(8, 'Password must have at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            'Password must have at least one uppercase letter, one lowercase letter, and one number'
        ),
});

const FormLogin = (props: FormLoginProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleClose } = props;
    const setUser = useAuthStore((state) => state.setUser);
    const form = useForm<IFormValues>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(loginFormSchema),
    });
    const { register, handleSubmit, formState, reset } = form;
    const { errors } = formState;

    const { mutate } = useMutation({
        mutationFn: (data: IFormValues) => {
            return fetchWithoutToken<IFormValues, { token: string }>(
                `${baseApiUrl}/auth/login`,
                data,
                'POST'
            );
        },
        onSuccess: (resp: { token: string }) => {
            setUser(resp.token);
            reset();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const navigateToPage = (newPage: number) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('page', String(newPage));
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };

    const onSubmit = (data: IFormValues) => {
        mutate({ ...data });
        handleClose();
        navigateToPage(1);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <DialogContent sx={{ width: { xs: '300px', sm: '500px' } }}>
                <TextField
                    required
                    fullWidth
                    id="email"
                    label={'Email Address'}
                    autoComplete="email"
                    {...register('email')}
                    sx={{ marginBottom: '20px' }}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    required
                    fullWidth
                    label={'Password'}
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    {...register('password')}
                    sx={{ marginBottom: '20px' }}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
            </DialogContent>
            <DialogActions>
                <Button type="submit">Submit</Button>
            </DialogActions>
        </Box>
    );
};

export default FormLogin;
