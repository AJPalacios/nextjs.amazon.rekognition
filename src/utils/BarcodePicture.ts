// @ts-ignore: Object is possibly 'null'.
export default class BarcodePicture {
    width: any = 320;
    height: any = 0;
    streaming: boolean = false;
    video: any = null;
    canvas: any = null;
    photo: HTMLElement = null;
    startbutton: HTMLElement = null;
    dataUrl: any = null;
    textDetected = ``;


    public showViewLiveResultButton() {
      if (window.self !== window.top) {
        // Ensure that if our document is in a frame, we get the user
        // to first open it in its own tab or window. Otherwise, it
        // won't be able to request permission for camera access.
        document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener("click", () => window.open(location.href));
        return true;
      }
      return false;
    }

    public startup(videoRef: any) {
      if (this.showViewLiveResultButton()) {
        return;
      }

      this.video = document.getElementById("video");
      this.canvas = document.getElementById("canvas");
      this.photo = document.getElementById("photo");
      this.startbutton = document.getElementById("startbutton");
      navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        console.log("stream", stream)
        this.video.srcObject = stream;
        this.video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

      this.video.addEventListener(
        "canplay",
        (ev: any) => {
          if (!this.streaming) {
            this.height = this.video.videoHeight / (this.video.videoWidth / this.width);
  
            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.
  
            if (isNaN(this.height)) {
              this.height = this.width / (4 / 3);
            }
  
            this.video.setAttribute("width", this.width);
            this.video.setAttribute("height", this.height);
            this.canvas.setAttribute("width", this.width);
            this.canvas.setAttribute("height", this.height);
            this.streaming = true;
          }
        },
        false
      );
  
      this.startbutton.addEventListener(
        "click",
        (ev: { preventDefault: () => void; }) => {
          this.takepicture();
          ev.preventDefault();
        },
        false
      );
  
      this.clearPhoto();

      
    }

    public clearPhoto() {
      const context = this.canvas.getContext("2d");
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      const data = this.canvas.toDataURL("image/png");
      this.photo.setAttribute("src", data);
    }

    public takepicture() {
      const context = this.canvas.getContext("2d");
      if (this.width && this.height) {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        context.drawImage(this.video, 0, 0, this.width, this.height);
  
        const data = this.canvas.toDataURL("image/png");
        this.dataUrl = this.canvas.toDataURL("image/png");
        // Call Rekognition.
        console.log(this.dataUrl)

        // const blob = this.canvas.toBlob(function(blob){
        //   blob.arrayBuffer()
        //   .then(response => {
        //     console.log(response)
        //     return response;
        //     // fetch("http://localhost:3000/api/rekognition", { method: "POST", body: this.dataUrl })
        //     // .then((response) => response.json())
        //     // .then((data) => console.log(data));
        //    })
        // },'image/png');


        fetch("https://nextjs-amazon-rekognition.vercel.app/api/rekognition", { method: "POST", body: this.dataUrl })
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            let detection = document.getElementById("textdetected")
            data.text.map((item: { DetectedText: string; }) => {
              detection.innerHTML = item.DetectedText + "<br>"
            })
          });
        this.photo.setAttribute("src", data);
      } else {
        this.clearPhoto();
      }
    }
    
    // Accesskey AKIARBAIMQYSUE5GLOWV
    // secret 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

}