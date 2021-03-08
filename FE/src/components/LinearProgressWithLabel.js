import React from 'react';
import { LinearProgress, Typography, Box } from '@material-ui/core';

function LinearProgressWithLabel(props) {
    if (!props.isVisible) return null
    else if (props.isLoading) {
        return (<>
            <div>{props.isLoading}</div>
            <LinearProgress />
        </>)
    }
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={100} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">100%</Typography>
            </Box>
        </Box>
    );
}

export default LinearProgressWithLabel;