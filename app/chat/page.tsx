import React from "react";
import { CanvasSpace } from "@/components/tambo/canvas-space";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";

const Chat = () => {
  return (
    <div className="flex h-screen py-6">
      <div className="flex flex-col h-full bg-white">
        <div className="w-[500px] min-w-[400px] h-full p-8">
          <MessageThreadFull contextKey="tambo-template" />
        </div>
      </div>

      <div className="flex-1 bg-white p-10">
        <CanvasSpace />
      </div>
    </div>
  );
};

export default Chat;
