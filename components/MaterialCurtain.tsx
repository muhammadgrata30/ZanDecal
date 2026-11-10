"use client";
import { type ReactNode } from "react";
import styles from "./MaterialCurtain.module.css";


/** Normal flow keeps studio and material anchors aligned in both scroll directions. */
export function MaterialCurtain({studio,children}:{studio:ReactNode;children:ReactNode}){
  return <div className={styles.transition}><div className={styles.material}>{children}</div><div className={styles.studio}>{studio}</div></div>;
}
