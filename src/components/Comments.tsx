import { UserCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  addComment,
  IArrangement,
  IComment,
  subscribeComments,
} from "../firebase/dbUtils";
import styled from "styled-components";
import moment from "moment";

type ICommentProps = {
  arrangement: IArrangement;
  user: UserCredential;
};
export const Comments = (props: ICommentProps) => {
  const { arrangement, user } = props;
  const [comments, setComments] = useState<IComment[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeComments(arrangement.id!, setComments);
    return () => unsubscribe();
  }, [arrangement.id]);

  const handleSubmit = async () => {
    if (!text) return;
    await addComment(arrangement.id!, text, user.user.email!);
    setText("");
  };

  return (
    <div>
      {comments.map((c) => {
        const createdDateRawExists = c.createdAt !== null;
        const createdAt = createdDateRawExists
          ? moment(c.createdAt.toDate()).format("HH:mm DD.MMM")
          : "";
        return (
          <Comment key={c.id}>
            <b>{c.createdBy}</b>
            <i> {createdAt}</i>
            <p>{c.text}</p>
          </Comment>
        );
      })}
      <StyledTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="kommenter noe da..."
      />
      <StyledButton onClick={handleSubmit}>Send det</StyledButton>
    </div>
  );
};

const Comment = styled.div`
  width: 100%;
  background-color: rgb(134, 300, 202);
  margin: 4px;
  padding: 4px;
  border-radius: 5px;
`;

const StyledButton = styled.button`
  width: 10%;
  background-color: rgb(134, 300, 202);
  margin: 10px;
  padding: 10px;
`;

const StyledTextarea = styled.textarea`
  width: 80%;
  background-color: rgb(134, 300, 202);
  margin: 10px;
  padding: 10px;
  min-height: 80px; /* height can grow */
  resize: vertical; /* allow vertical resize */
`;
