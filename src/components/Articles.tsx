import {
    Box,
    Button,
    capitalize,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Skeleton,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Empty from '../assets/empty.jpg';
import { INews } from '../types/news';
import { sortNewsByCategories } from '../helpers/sortNewsByCategories';
import { useAuthStore } from '../global/useAuthStore';

const Articles = ({
    data,
    isLoading,
}: {
    data: INews[];
    isLoading: boolean;
}) => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state);
    const sortedNewsArray = sortNewsByCategories(data, user.preferredTopics);

    return (
        <Box component="section" className="news-list">
            <Box className="news-list-center">
                {!isLoading &&
                    sortedNewsArray?.map((article) => {
                        const {
                            id,
                            title,
                            description,
                            urlToImage,
                            state,
                            publishedAt,
                            category,
                        } = article;
                        const handleNavigate = () =>
                            navigate(`/article/${id}`, {
                                state: { article },
                            });
                        return (
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                                key={id}
                            >
                                {!isLoading ? (
                                    <>
                                        <CardContent
                                            onClick={handleNavigate}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <CardMedia
                                                component="img"
                                                alt={title}
                                                height="140"
                                                image={urlToImage || Empty}
                                                sx={{ marginBottom: 2 }}
                                            />
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                            >
                                                {title}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                }}
                                            >
                                                {description}
                                            </Typography>
                                            <br />
                                            {!!state && (
                                                <Typography>
                                                    State: {state}
                                                </Typography>
                                            )}
                                            {!!category && (
                                                <Typography>
                                                    Topic:{' '}
                                                    {capitalize(category)}
                                                </Typography>
                                            )}
                                            {!!publishedAt && (
                                                <Typography>
                                                    Published At:{' '}
                                                    {new Date(
                                                        publishedAt
                                                    )?.toLocaleString()}
                                                </Typography>
                                            )}
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                onClick={handleNavigate}
                                                size="small"
                                            >
                                                Read More
                                            </Button>
                                        </CardActions>
                                    </>
                                ) : (
                                    <CardContent>
                                        <Skeleton sx={{ height: 240 }} />
                                        <Skeleton />
                                        <Skeleton />
                                        <Skeleton />
                                        <Skeleton />
                                        <Skeleton />
                                        <Skeleton />
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
            </Box>
        </Box>
    );
};

export default Articles;
