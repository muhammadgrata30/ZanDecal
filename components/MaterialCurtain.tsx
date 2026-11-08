"use client";
import { type ReactNode } from "react";
import styles from "./MaterialCurtain.module.css";
import { SectionCurtain } from "./experience/SectionCurtain";

/** Normal flow keeps studio and material anchors aligned in both scroll directions. */
export function MaterialCurtain({studio,children}:{studio:ReactNode;children:ReactNode}){
  return <div className={styles.transition}><SectionCurtain variant="studio" previous={<div className={styles.material}>{children}</div>} next={<div className={styles.studio}>{studio}</div>}/></div>;
}
