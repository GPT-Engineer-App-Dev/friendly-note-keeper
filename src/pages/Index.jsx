import { Box, Button, Input, Textarea, SimpleGrid, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { client } from "../../lib/crud";

const NoteCard = ({ note, onDelete, onEdit }) => (
  <Box p={4} borderWidth="1px" borderRadius="lg">
    <Input value={note.title} isReadOnly />
    <Textarea value={note.content} isReadOnly mt={2} />
    <Button leftIcon={<FaTrash />} colorScheme="red" size="sm" onClick={() => onDelete(note.id)} mt={2}>
      Delete
    </Button>
    <Button leftIcon={<FaEdit />} colorScheme="teal" size="sm" onClick={() => onEdit(note)} mt={2} ml={2}>
      Edit
    </Button>
  </Box>
);

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const toast = useToast();

  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await client.getWithPrefix("note:");
      setNotes(fetchedNotes.map(n => ({ id: n.key, ...n.value })));
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    const id = `note:${Date.now()}`;
    const success = await client.set(id, newNote);
    if (success) {
      setNotes([...notes, { id, ...newNote }]);
      setNewNote({ title: "", content: "" });
      toast({
        title: "Note added.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteNote = async (id) => {
    const success = await client.delete(id);
    if (success) {
      setNotes(notes.filter(note => note.id !== id));
      toast({
        title: "Note deleted.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleEditNote = async (editedNote) => {
    const success = await client.set(editedNote.id, editedNote);
    if (success) {
      setNotes(notes.map(note => (note.id === editedNote.id ? editedNote : note)));
      toast({
        title: "Note updated.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Input placeholder="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
      <Textarea placeholder="Content" value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} mt={2} />
      <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleAddNote} mt={2}>
        Add Note
      </Button>
      <SimpleGrid columns={3} spacing={4} mt={4}>
        {notes.map(note => (
          <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} onEdit={handleEditNote} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Index;