import React from 'react';

const Home = () => {
    return (
    <div style={styles.container}>
        <h1 style={styles.heading}>Welcome to ProgramIT</h1>
    </div>
    );
};

const styles = {
    container: 
    {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    heading:
    {
        fontSize: '24px',
        fontWeight: 'bold',
    },
};

export default Home;
