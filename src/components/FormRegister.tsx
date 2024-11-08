import {
    Box,
    Button,
    Checkbox,
    DialogActions,
    DialogContent,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { baseApiUrl, categoryList } from '../constants/data';
import { useMutation } from '@tanstack/react-query';
import { fetchWithoutToken } from '../helpers/fetch';
import { toast } from 'react-toastify';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface IFormValues {
    fullName: string;
    email: string;
    password: string;
}

interface IMutationInput extends IFormValues {
    preferredTopics: string[];
}

const registerFormSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email("Email isn't valid"),
    password: z
        .string()
        .min(8, 'Password must have at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            'Password must have at least one uppercase letter, one lowercase letter, and one number'
        ),
});

type FormRegisterProps = {
    handleClose: () => void;
};

const FormRegister = (props: FormRegisterProps) => {
    const { handleClose } = props;
    const form = useForm<IFormValues>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
        resolver: zodResolver(registerFormSchema),
    });
    const [preferredTopics, setPreferredTopics] = useState<string[]>([]);
    const { register, handleSubmit, formState, reset } = form;
    const { errors } = formState;

    const { mutate } = useMutation({
        mutationFn: (data: IMutationInput) => {
            return fetchWithoutToken<IMutationInput, { message: string }>(
                `${baseApiUrl}/auth/register`,
                data,
                'POST'
            );
        },
        onSuccess: (resp: { message: string }) => {
            toast.success(resp.message);
            setPreferredTopics([]);
            reset();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleChange = (event: SelectChangeEvent<typeof preferredTopics>) => {
        const {
            target: { value },
        } = event;
        setPreferredTopics(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const onSubmit = (data: IFormValues) => {
        mutate({ ...data, preferredTopics });
        handleClose();
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <DialogContent>
                <TextField
                    required
                    fullWidth
                    id="fullName"
                    label={'Full Name'}
                    autoComplete="full-name"
                    autoFocus
                    {...register('fullName')}
                    sx={{ marginBottom: '20px' }}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                />
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
                <FormControl fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">
                        Topics
                    </InputLabel>
                    <Select
                        fullWidth
                        labelId="demo-multiple-checkbox-label"
                        id="topics"
                        multiple
                        value={preferredTopics}
                        onChange={handleChange}
                        input={<OutlinedInput label="Topics" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        {categoryList.map((item) => (
                            <MenuItem key={item} value={item}>
                                <Checkbox
                                    checked={preferredTopics.includes(item)}
                                />
                                <ListItemText primary={item} />
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        Select the topics that interest you most.
                    </FormHelperText>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button type="submit">Submit</Button>
            </DialogActions>
        </Box>
    );
};

export default FormRegister;
