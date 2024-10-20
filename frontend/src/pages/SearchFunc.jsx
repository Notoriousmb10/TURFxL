import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Card, CardContent, Typography, CardMedia } from '@mui/material';
import SearchBar from '../shared/SearchBar';
import SearchResults from './SearchResult';

const SearchFunc = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Perform search logic here and update results
    // For now, we'll use dummy data
    const dummyResults = [
      {
        id: 1,
        name: 'Turf 1',
        location: 'Location 1',
        image: 'https://via.placeholder.com/150',
        description: 'Description for Turf 1',
      },
      {
        id: 2,
        name: 'Turf 2',
        location: 'Location 2',
        image: 'https://via.placeholder.com/150',
        description: 'Description for Turf 2',
      },
    ];
    setResults(dummyResults);
  };

  return (
    <Container>
      <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Search for Turfs"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {results.map((result) => (
          <Grid item xs={12} sm={6} md={4} key={result.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={result.image}
                alt={result.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {result.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchFunc;