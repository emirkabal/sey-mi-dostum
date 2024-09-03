import { useCallback, useEffect, useRef, useState } from "react";
import cn from "classnames";
import video from "./assets/andicocuk.mp4";
import {
  BAD_ENDING_MESSAGES,
  getRandomMessage,
  GOOD_ENDING_MESSAGES,
} from "./constants";

enum State {
  LOADING_VIDEO,
  NEED_PERMISSION_TO_PLAY_VIDEO,
  PLAY_VIDEO,
  ASK_1,
  GOOD_END,
  BAD_END,
  FINISH_SCREEN,
}

function App() {
  const [state, setState] = useState<State>(
    State.NEED_PERMISSION_TO_PLAY_VIDEO
  );
  const [text, setText] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    const time = video?.currentTime;
    if (!video || !time) return;

    if (time >= 3.35 && state === State.PLAY_VIDEO) {
      setText("ANDI NE LAN?");
      video.pause();
      setState(State.ASK_1);
    } else if (time >= 34 && state === State.GOOD_END) {
      setText(getRandomMessage(GOOD_ENDING_MESSAGES));
      setState(State.FINISH_SCREEN);
    } else if (time >= 13.4 && state === State.BAD_END) {
      setText(getRandomMessage(BAD_ENDING_MESSAGES));
      video.pause();
      setState(State.FINISH_SCREEN);
    }
  }, [state, videoRef]);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.volume = 0.5;
      switch (state) {
        case State.PLAY_VIDEO:
          video.currentTime = 1.4;
          video.play();
          setText("");
          break;
        case State.ASK_1:
          setText("ANDI NE LAN?");
          video.currentTime = 3.35;
          break;
        case State.GOOD_END:
          setText("");
          video.currentTime = 19.4;
          video.play();
          break;
        case State.BAD_END:
          setText("");
          video.currentTime = 4.2;
          video.play();
          break;
        case State.FINISH_SCREEN:
          setText("-");
          break;
      }
    }

    video?.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [state, videoRef, handleTimeUpdate]);

  return (
    <>
      <main
        className={cn(
          "bg-black flex-col gap-y-14 px-4 sm:text-2xl text-white h-screen flex items-center justify-center",
          {
            "!justify-start py-8":
              state !== State.NEED_PERMISSION_TO_PLAY_VIDEO &&
              state !== State.FINISH_SCREEN,
          }
        )}
      >
        {state === State.NEED_PERMISSION_TO_PLAY_VIDEO && (
          <>
            <button
              onClick={() => setState(State.PLAY_VIDEO)}
              className="px-12 py-4  border-2 border-white  hover:bg-white hover:text-black"
            >
              Andımızı okur musun?
            </button>
          </>
        )}
        {state !== State.NEED_PERMISSION_TO_PLAY_VIDEO && (
          <>
            {state !== State.FINISH_SCREEN && (
              <div className="h-auto w-full sm:w-1/2">
                <video
                  className="w-full h-full object-cover"
                  playsInline
                  ref={videoRef}
                  src={video}
                ></video>
              </div>
            )}

            <p
              className={cn("text-center text-2xl sm:text-4xl font-bold", {
                "h-4": state !== State.FINISH_SCREEN,
              })}
            >
              {text}
            </p>

            {state === State.FINISH_SCREEN && (
              <>
                <button
                  onClick={() => setState(State.ASK_1)}
                  className="px-12 py-4 border-white border-2 hover:bg-white hover:text-black"
                >
                  Tekrar dene
                </button>
              </>
            )}

            {state === State.ASK_1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setState(State.GOOD_END)}
                  className="px-12 py-4 border-white border-2 hover:bg-white hover:text-black"
                >
                  Türk'üm, doğruyum
                </button>
                <button
                  onClick={() => setState(State.BAD_END)}
                  className="px-12 py-4 border-white border-2 hover:bg-white hover:text-black"
                >
                  Şey mi dostum?
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <div className="fixed bottom-0 w-full p-4 flex gap-x-4">
        <a
          href="https://github.com/emirkabal/sey-mi-dostum"
          target="_blank"
          className="hover:text-white text-gray-300"
        >
          Github
        </a>
      </div>
    </>
  );
}

export default App;
