import { useState } from "react";
import { Button } from "@material-ui/core";
import moment from "moment";
import CreateComment from "raw-loader!../graphql/create-comment.gql";
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
} from "../graphql/types";
import { getToken, getSignInUrl } from "../utils/frontend-auth";
import { gql, useMutation } from "@apollo/client";
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/dist/markdown-editor.css'
import '@uiw/react-markdown-preview/dist/markdown.css';

function Comment({
  author,
  text,
  createdAt,
}: {
  author: string;
  text: string;
  createdAt: Date;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "10px",
          fontSize: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>{author}</div>
          <div
            style={{
              marginLeft: "10px",
              color: "rgba(0,0,0,0.5)",
              fontSize: "12px",
            }}
          >
            {moment(new Date()).from(moment(createdAt))}
          </div>
        </div>

        <div><MDEditor.Markdown source={text} /></div>
      </div>
    </div>
  );
}

type CommentI = {
  id: string;
  createdAt: string;
  comment: string;
  author: {
    id: string;
    username: string;
  };
};

function checkLoggedIn() {
  try {
    if (!getToken()) {
      return (
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginRight: "20px" }}>
          You must be logged in to post a comment
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (window.location.href = getSignInUrl())}
        >
          Login
        </Button>
      </div>
    );
    }
  } catch (e) { }

  return null;
} 

export function CommentsSection({
  comments,
  deckId,
  cardId,
}: {
  comments: CommentI[];
  deckId?: string;
  cardId?: string;
}) {
  const [textAreaRef, setTextAreaRef]: [
    any,
    (ref: any) => void
  ] = useState(undefined);
  const [createComment] = useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(gql(CreateComment));

  const [newComment, setNewComment] = useState('');

  return (
    <div>
      <div
        style={{
          borderBottom: "1px solid lightgrey",
          fontWeight: "bold",
          paddingTop: "20px",
          marginBottom: "10px",
          width: "97%",
        }}
      >
        Comments
      </div>
      {comments.map(({ author, comment, createdAt }, i) => (
        <Comment
          key={i}
          author={author.username}
          text={comment}
          createdAt={new Date(createdAt)}
        ></Comment>
      ))}
      {/* <textarea
        style={{
          borderRadius: "5px",
          height: "100px",
          width: "50%",
          resize: "vertical",
          marginBottom: "5px",
        }}
        ref={(ref) => setTextAreaRef(ref)}
      ></textarea> */}      
      { checkLoggedIn() }

      { getToken() ?
      <div>
        <MDEditor value={newComment} onChange={(val) => setNewComment(val)} />
        <Button
          variant="outlined"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            marginBottom: "10px",
          }}
          onClick={() => {
            createComment({
              variables: {
                comment: newComment,
                ...(deckId ? { deckId } : { cardId }),
              },
            });
            setNewComment('');
          }}
        >
          <div>Add Reply</div>
        </Button>
      </div>
      : null }
    </div>
  );
}
