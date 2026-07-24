"use client";

import useAuth from "@/helpers/isAuth";
import axios from "axios";
import style from "./index.module.css";
import { useEffect, useState } from "react";
import PostCard from "@/components/layout/postCard";
import { useSearchParams } from "next/navigation";

export default function Profile() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [posts, setPosts] = useState([]);
  const [loadPost, setLoadPost] = useState(true);
  const { user, loading } = useAuth({ requireAuth: true });

  useEffect(() => {
    if (!username) return;

    async function fetchPosts() {
      setLoadPost(true);
      try {
        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/profile/${username}`,
          { withCredentials: true },
        );

        if (resp.data.success) {
          setPosts(resp.data.userPosts || []);
        }
      } catch (err) {
        console.log("Erro ao carregar posts");
      } finally {
        setLoadPost(false);
      }
    }

    fetchPosts();
  }, [username]);

  if (loadPost) {
    return <p>Carregando...</p>;
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  const handleDeleteSuccess = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId),
    );
  };

  return (
    <div className={style.main_Container}>
      {posts.map((post) => {
        return (
          <PostCard
            key={post.id}
            post={post}
            user={user}
            onDeleteSuccess={handleDeleteSuccess}
          />
        );
      })}
    </div>
  );
}
