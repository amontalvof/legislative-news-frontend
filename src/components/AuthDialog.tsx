import {
    Avatar,
    Box,
    Dialog,
    DialogTitle,
    Slide,
    Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import FormRegister from './FormRegister';
import FormLogin from './FormLogin';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type AuthDialogProps = {
    openDialog: { open: boolean; type: string };
    handleClose: () => void;
};

const AuthDialog = (props: AuthDialogProps) => {
    const { openDialog, handleClose } = props;
    const { open, type } = openDialog;
    const title = type === 'login' ? 'Login' : 'Register';
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle sx={{ paddingBottom: 0 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>
            {type === 'login' ? (
                <FormLogin handleClose={handleClose} />
            ) : (
                <FormRegister handleClose={handleClose} />
            )}
        </Dialog>
    );
};

export default AuthDialog;
