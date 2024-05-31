import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface ChipData {
  key: number;
  label: string;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export function MultiSelect({chipData, setChipData}) {
  
  const [inputValue, setInputValue] = useState('');

  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleAddChip = () => {
    const newKey = chipData.length ? chipData[chipData.length - 1].key + 1 : 0;
    if (inputValue.trim()) {
      setChipData([...chipData, { key: newKey, label: inputValue }]);
      setInputValue('');
    }
  };

  return (
    <>
      <Paper
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          listStyle: 'none',
          p: 0.5,
          m: 0,
          minWidth: 270,
          maxWidth: 300, // Adjust this value as needed to make MultiSelect smaller
          margin: 'auto', // Center the MultiSelect
        }}
        component="ul"
      >
        {chipData.map((data) => {
          let icon;

          if (data.label === 'React') {
            icon = <TagFacesIcon />;
          }

          return (
            <ListItem key={data.key}>
              <Chip
                icon={icon}
                label={data.label}
                onDelete={handleDelete(data)}
              />
            </ListItem>
          );
        })}
      </Paper>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <TextField
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          variant="outlined"
          placeholder="Media type"
          style={{ marginRight: 8, backgroundColor: "white" }}
        />
        <Button variant="contained" onClick={handleAddChip}>Add</Button>
      </div>
    </>
  );
}
