import style from "./index.module.css";
import { BiLike, BiComment, BiTrash } from "react-icons/bi";
import axios from "axios";
import CstmLink from "../Link";
import CstmButton from "../button";
import { useRouter } from "next/navigation";

export default function PostCard({ post, user, onDeleteSuccess }) {
  const router = useRouter();

  const DeletePost = async function (e, postId) {
    e.preventDefault();
    try {
      const resp = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/post/delete/${postId}`,
        {
          withCredentials: true,
        },
      );

      if (resp.data.success) {
        onDeleteSuccess(postId);
      }
    } catch (err) {
      console.log("Erro ao deletar post.");
    }
  };

  return (
    <article className={style.article_Container}>
      <div className={style.info_Container}>
        <CstmLink
          LinkTo={`/profile?username=${post.author.username}`}
          className={"border-link"}
          Text={"@" + post.author.username}
        />

        <small>
          {new Date(post.createdAt).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
        </small>

        {post.author?.id === user?.id ? (
          <CstmButton
            type={"button"}
            Text={<BiTrash />}
            onClick={(e) => DeletePost(e, post.id)}
          />
        ) : null}
      </div>

      <div className={style.post_Container}>
        <h3>{post.title}</h3>

        <p>{post.content}</p>
      </div>

      <div className={style.button_Container}>
        <div className={style.like_Container}>
          <CstmButton type={"button"} Text={<BiLike />} />{" "}
          <small>{post.likes} Likes</small>
        </div>
        <div className={style.comment_Container}>
          <CstmButton type={"button"} Text={<BiComment />} />{" "}
          <small>{post.comments} Comentários</small>
        </div>
      </div>
    </article>
  );
}
