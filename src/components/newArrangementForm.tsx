import styled from "styled-components";
import {
  addArrangement,
  getAllUsers,
  IArrangement,
  IUserProfile,
  updateArrangement,
} from "../firebase/dbUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
  user: IUserProfile;
  arrangement?: IArrangement; // Omit when creating
}

export const NewArrangementFormModal = (props: IProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IArrangement>(
    props.arrangement ?? {
      id: "",
      startTime: "",
      title: "",
      description: "",
      createdAt: new Date(),
      createdByEmail: props.user.email ?? undefined,
      guestList: [],
    },
  );
  const [users, setUsers] = useState<IUserProfile[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };

    loadUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      const selectedValues = Array.from(
        e.target.selectedOptions,
        (option) => option.value,
      );

      setFormData((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (props.arrangement) {
      await updateArrangement(props.arrangement.id, formData);
    } else {
      await addArrangement(formData);
    }

    navigate("/arrangements");
  };

  return (
    <FormContainer>
      <h2>{props.arrangement ? "Endre på ditta!" : "Lag splitter ny!"}</h2>{" "}
      <form onSubmit={handleSubmit}>
        <Label htmlFor="startTime">Når?</Label>
        <Input
          type="datetime-local"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
        <Label htmlFor="title">Tittel</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Label htmlFor="description">Beskrivelse...</Label>
        <TextArea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />
        <Label>Hmm Hvemm får komme?</Label>
        <UserList>
          {users
            .filter((u) => u.email && u.email !== props.user.email)
            .map((u) => (
              <CheckboxLabel key={u.email}>
                <input
                  type="checkbox"
                  checked={(formData.guestList ?? []).includes(u.email)}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      guestList: e.target.checked
                        ? [...(prev.guestList ?? []), u.email]
                        : (prev.guestList ?? []).filter(
                            (email) => email !== u.email,
                          ),
                    }));
                  }}
                />
                {u.nickname || u.email}
              </CheckboxLabel>
            ))}
        </UserList>
        <Button type="submit">
          {props.arrangement ? "Lagr endring" : "Lounge dette eventet!!!!"}
        </Button>{" "}
      </form>
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
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

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  input {
    cursor: pointer;
  }
`;
