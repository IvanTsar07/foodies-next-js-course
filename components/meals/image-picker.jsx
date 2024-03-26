"use client";

import { useRef, useState } from "react";
import classes from "./image-picker.module.css";
import Image from "next/image";

export default function ImagePicker({ label, name = "image" }) {
  const [pickedImage, setPickedImage] = useState();
  const imageInputRef = useRef();

  function onPickClick() {
    imageInputRef.current.click();
  }

  function onImagePicked(event) {
    const file = event.target.files[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPickedImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="Picked image"
              fill
            />
          )}
          {!pickedImage && <p>No image picked.</p>}
        </div>

        <input
          ref={imageInputRef}
          className={classes.input}
          type="file"
          id={name}
          name={name}
          accept="image/png, image/jpeg"
          onChange={onImagePicked}
          required
        />
        <button
          onClick={onPickClick}
          className={classes.button}
          type="button"
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
