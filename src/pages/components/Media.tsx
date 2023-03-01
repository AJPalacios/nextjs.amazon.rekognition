import styles from "@/styles/Media.module.css";
import BarcodePicture from "@/utils/BarcodePicture";
import { useEffect, useMemo, useRef } from "react";

export default function Media() {
    const videoElement = useRef(null);
    const barcode = useMemo(() => new BarcodePicture(), [])
    
    useEffect(() => {
        barcode.startup(videoElement);
    },[barcode]);

    return (
        <div className={styles.contentarea}>
            <h1>MDN - navigator.mediaDevices.getUserMedia(): Still photo capture demo</h1>
            <p>
                This example demonstrates how to set up a media stream using your built-in
                webcam, fetch an image from that stream, and create a PNG using that image.
            </p>
            <div className={styles.camera}>
                <video ref={videoElement} id="video">Video stream not available.</video>
                <button id="startbutton">Take photo</button>
            </div>
            <canvas id="canvas"> </canvas>
            <div className={styles.output}>
                <img id="photo" alt="The screen capture will appear in this box." />
            </div>
            <p id="textdetected" style={{ color: "white" }}></p>
        </div>
    );
}
