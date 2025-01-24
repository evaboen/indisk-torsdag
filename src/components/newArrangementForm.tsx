import styled from "styled-components";
import { addData } from "../firebase/dbUtils";
import { useState } from "react";

export const NewArrangementFormModal = () => {
  const a = {
    startTime: "New Item",
    endTime: "end",
    title: "first event",
    description: "This is a new item.",
    createdAt: new Date(),
  };

  const [formData, setFormData] = useState({
    id: '',
    startTime: '',
    endTime: '',
    title: '',
    description: '',
    createdAt: new Date(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addData( formData);
    //alert('Arrangement Submitted!');
  };


  return (
<FormContainer>
      <h2>Create Arrangement</h2>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          type="datetime-local"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />

        <Label htmlFor="endTime">End Time</Label>
        <Input
          type="datetime-local"
          id="endTime"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />

        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />

        <Button type="submit">Opprett </Button>
      </form>
    </FormContainer>      
  );
};

// Styled Components
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflowHidden
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  margin-bottom: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const TextArea = styled.textarea`
  margin-bottom: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
