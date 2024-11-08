import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Pagination, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Banner from '../components/Banner';
import Filters from '../components/Filters';
import { resolveQueryUrl } from '../helpers/resolveQueryUrl';
import Articles from '../components/Articles';
import AuthDialog from '../components/AuthDialog';
import { fetchWithoutToken } from '../helpers/fetch';
import { INews } from '../types/news';
import { useAuthStore } from '../global/useAuthStore';
import socket from '../ws/socket';
import { toast } from 'react-toastify';

const NewsList = () => {
    const user = useAuthStore((state) => state);
    const location = useLocation();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [state, setState] = useState<string>('');
    const [topic, setTopic] = useState<string>('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [openDialog, setOpenDialog] = useState({
        open: false,
        type: '',
    });

    const sortKeywords = user?.preferredTopics ?? [];

    const { data, isLoading, refetch } = useQuery<{
        rows: INews[];
        totalPages: number;
    }>({
        queryKey: ['news', { state, topic, keywords, page, sortKeywords }],
        queryFn: () =>
            fetchWithoutToken(
                resolveQueryUrl({
                    state,
                    topic,
                    keywords,
                    sortKeywords,
                    page,
                    pageSize: 8,
                })
            ),
    });

    const navigateToPage = (newPage: number) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('page', String(newPage));
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };

    const handleOpenDialog = (type: string) => {
        setOpenDialog({ open: true, type });
    };

    const handleCloseDialog = () => {
        setOpenDialog({ open: false, type: '' });
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const pageParam = queryParams.get('page');
        if (pageParam) {
            setPage(Number(pageParam));
        }
    }, [location.search]);

    useEffect(() => {
        socket.on('new-article', (article) => {
            const { title, category } = article;
            refetch();
            toast.info(
                <Box>
                    <Typography variant="h6" component="div">
                        New Article
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Title: {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Category: {category}
                    </Typography>
                </Box>
            );
        });
        return () => {
            socket.off('new-article');
        };
    }, []);

    return (
        <Box>
            <Box className="newsBg">
                <Box sx={{ position: 'absolute', right: '0', padding: '10px' }}>
                    {user.fullName ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: { xs: 'start', sm: 'center' },
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#ffffff',
                                    marginRight: '5px',
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                Welcome {user.fullName}
                            </Typography>
                            <Button
                                onClick={() => user?.clearUser()}
                                sx={{
                                    margin: '0 5px',
                                    color: '#ffffff',
                                    borderColor: '#ffffff',
                                }}
                                variant="outlined"
                            >
                                Logout
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Button
                                onClick={() => handleOpenDialog('login')}
                                sx={{
                                    margin: '0 5px',
                                    color: '#ffffff',
                                    borderColor: '#ffffff',
                                }}
                                variant="outlined"
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => handleOpenDialog('register')}
                                sx={{
                                    margin: '0 5px',
                                    color: '#ffffff',
                                    borderColor: '#ffffff',
                                }}
                                variant="outlined"
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
                <Banner />
            </Box>
            <Filters
                state={state}
                setState={setState}
                topic={topic}
                setTopic={setTopic}
                navigateToPage={navigateToPage}
                keywords={keywords}
                setKeywords={setKeywords}
            />
            {data?.rows?.length ? (
                <Articles data={data?.rows} isLoading={isLoading} />
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '50vh',
                        textAlign: 'center',
                        color: 'gray',
                    }}
                >
                    <SearchOffIcon sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        No articles found
                    </Typography>
                    <Typography variant="body1">
                        Try adjusting your search or filter to find what you're
                        looking for.
                    </Typography>
                </Box>
            )}
            {!!data?.rows?.length && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: '5rem',
                    }}
                >
                    <Pagination
                        count={data?.totalPages ?? 10}
                        page={page}
                        onChange={(
                            _event: ChangeEvent<unknown>,
                            newPage: number
                        ) => navigateToPage(newPage)}
                        size="large"
                        shape="rounded"
                        variant="outlined"
                    />
                </Box>
            )}
            <AuthDialog
                openDialog={openDialog}
                handleClose={handleCloseDialog}
            />
        </Box>
    );
};

export default NewsList;
