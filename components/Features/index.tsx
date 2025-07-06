import React from "react";
import {
  BotMessageSquareIcon,
  ContactRoundIcon,
  TimerIcon,
  SearchIcon,
  CircleUserRoundIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Marquee } from "../magicui/marquee";
import { AnimatedList } from "../magicui/animated-list";
import { BentoCard, BentoGrid } from "../magicui/bento-grid";
import AnimatedBeamDemo from "../AnimatedBeamDemo";
import { Calendar } from "../ui/calendar";
import { truncate } from "lodash";

const messages = [
  {
    name: "Jack",
    username: "@jack",
    body: "Hi bot, what is the current price of the TRUMP token?",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "John",
    username: "@john",
    body: "Today is my girlfriend birthday, send her a happy birthday NFT to her address",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Alice",
    username: "@Alice",
    body: "Analyze this contract address to find out the risks involved with it",
    img: "https://avatar.vercel.sh/alice",
  },
  {
    name: "Bob",
    username: "@Bob",
    body: "Send me a report of my NFT transactions for May 2025",
    img: "https://avatar.vercel.sh/bob",
  },
  {
    name: "Enoch",
    username: "@Enoch",
    body: "Give me the list of coins that just graduated pump(dot)fun",
    img: "https://avatar.vercel.sh/enoch",
  },
];

const contacts = [
  {
    name: "gawkyDev",
    description: truncate("E1nqiSDoqbrXmCFoZsjmu8zQ271EcbfZNXztwrhYxeAt", {
      length: 10,
    }),
    time: "1min ago",
  },
  {
    name: "nerdyDev",
    description: truncate("7Gp9nSXrWBs1iNgr9aFeFJ8noZWzgewkpXnhzj6w3jg6", {
      length: 10,
    }),
    time: "now",
  },
];

const features = [
  {
    Icon: BotMessageSquareIcon,
    name: "Onchain AI Assistant",
    description:
      "Get to interact with an AI that can provide onchain insights for whatever you need.",
    href: "/login",
    cta: "Get started",
    className: "col-span-12 lg:col-span-5",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-5 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {messages.map(({ name, username, img, body }, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
              // light styles
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              // dark styles
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <img
                className="rounded-full"
                width="32"
                height="32"
                alt={name}
                src={img}
              />
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  {name}
                </figcaption>
                <p className="text-xs font-medium dark:text-white/40">
                  {username}
                </p>
              </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: ContactRoundIcon,
    name: "Manage Contacts",
    description:
      "Manage and easily send or schedule SPL or solana transfers to your contact(s)",
    href: "/login",
    cta: "Get started",
    className: "col-span-12 lg:col-span-7",
    background: (
      <AnimatedList className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90">
        {contacts.map(({ name, time, description }, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
              // animation styles
              "transition-all duration-200 ease-in-out hover:scale-[103%]",
              // light styles
              "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
              // dark styles
              "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
            )}
          >
            <div className="flex flex-row items-center gap-3">
              <div className="bg-gray-50 border border-gray-200 flex size-10 items-center justify-center rounded-2xl">
                <CircleUserRoundIcon size={22} className="stroke-[1.5]" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
                  <span className="text-sm sm:text-lg">{name}</span>
                  <span className="mx-1">·</span>
                  <span className="text-xs text-gray-500">{time}</span>
                </figcaption>
                <p className="text-sm font-normal dark:text-white/60">
                  {description}
                </p>
              </div>
            </div>
          </figure>
        ))}
      </AnimatedList>
    ),
  },
  {
    Icon: SearchIcon,
    name: "Query Onchain Info",
    description:
      "Now an interactive and easy way to query information about tokens or nfts onchain.",
    href: "/login",
    cta: "Get started",
    className: "col-span-12 md:col-span-6 lg:col-span-7",
    background: <AnimatedBeamDemo />,
  },
  {
    Icon: TimerIcon,
    name: "Schedule Transactions",
    description:
      "What is an AI assistant without being able to schedule transactions?",
    className: "col-span-12 md:col-span-6 lg:col-span-5",
    href: "/login",
    cta: "Get started",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2026, 5, 11, 0, 0, 0)}
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
      />
    ),
  },
];

const Features = () => {
  return (
    <BentoGrid className="gap-5 grid-cols-12 lg:grid-cols-12">
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
};

export default Features;
