import { Box, Typography } from '@mui/material';

const Title = ({ title }: { title: string }) => {
    return (
        <Box className="section-title">
            <Typography component="h4">{title}</Typography>
            <Box />
        </Box>
    );
};

export default Title;
