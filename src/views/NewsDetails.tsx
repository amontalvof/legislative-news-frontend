import { Box, Button, Link, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Empty from '../assets/empty.jpg';

const NewsDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { article } = location.state || {};
    const {
        author,
        title,
        url,
        urlToImage,
        content,
        state,
        sourceName,
        publishedAt,
        category,
    } = article;
    const formattedContent = content?.split('… [')[0];
    return (
        <Box>
            <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ margin: '20px' }}
            >
                Go Back
            </Button>
            <Box
                sx={{
                    minHeight: { xs: '30vh', sm: '50vh' },
                    background: {
                        xs: `url('${
                            urlToImage || Empty
                        }') center/cover no-repeat`,
                        sm: `url('${
                            urlToImage || Empty
                        }') center/contain no-repeat`,
                    },
                }}
            />
            <Box component="section" className="single-news-info">
                <Box component="article" className="desc">
                    {title && <Typography component="h3">{title}</Typography>}
                    {formattedContent && (
                        <Typography>{formattedContent}…</Typography>
                    )}
                    {url && (
                        <Link href={url} target="_blank" rel="noreferrer">
                            <Typography>Read the Full Article</Typography>
                        </Link>
                    )}
                </Box>
                <Box component="article" className="info">
                    <Typography component="h3">Info</Typography>
                    {author && (
                        <Typography component="h6">Author: {author}</Typography>
                    )}
                    {category && (
                        <Typography component="h6">
                            Topic: {category}
                        </Typography>
                    )}
                    {state && (
                        <Typography component="h6">State: {state}</Typography>
                    )}
                    {sourceName && (
                        <Typography component="h6">
                            Source: {sourceName}
                        </Typography>
                    )}
                    {publishedAt && (
                        <Typography component="h6">
                            Published At:{' '}
                            {new Date(publishedAt).toLocaleString()}
                        </Typography>
                    )}
                </Box>
            </Box>
            <Box></Box>
        </Box>
    );
};

export default NewsDetails;
