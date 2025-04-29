# **App Name**: Furia Fan Zone

## Core Features:

- Live Chat Feed: Display a live chat feed with messages from users and bot updates.
- Game Status Indicator: Display the current game status (AQUECENDO, AO VIVO, FINALIZADO).
- Fan Ranking: Display a ranking of the most active fans based on message count.

## Style Guidelines:

- Primary color: Dark gray (#2c2c2c) for the background and card backgrounds.
- Secondary color: White (#FFFFFF) for text.
- Accent color: Yellow (#FFDA63) for highlights and interactive elements.
- Use a sans-serif font for overall readability.
- Use a centered layout with a maximum width for the main content area.
- Use subtle animations for transitions and interactive elements.

## Original User Request:
import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Smile, ThumbsUp, LogIn, UploadCloud } from "lucide-react";

const mockMessages = [
  { id: 1, user: "Torcedor1", message: "GO FURIAAAAA! 🔥", reactions: 0 },
  { id: 2, user: "Torcedor2", message: "Alguém viu o clutch do arT? Insano!", reactions: 0 },
  { id: 3, user: "Bot", message: "Jogo contra NAVI começa às 19h - status: AQUECENDO 🔥", reactions: 0 },
];

const notificationSound = typeof Audio !== "undefined" ? new Audio("/notification.mp3") : null;

const customEmojis = {
  ":furia:": "🐍",
  ":art:": "🎯",
  ":victory:": "🏆"
};

function replaceEmojis(text) {
  return text.replace(/:\w+:/g, (match) => customEmojis[match] || match);
}

export default function Home() {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("AQUECENDO");
  const [user, setUser] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [poll, setPoll] = useState({ question: "Quem foi o MVP do último jogo?", options: ["arT", "KSCERATO", "yuurih"], votes: {} });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const statuses = ["AQUECENDO", "AO VIVO", "FINALIZADO"];
    let currentIndex = statuses.indexOf(status);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
      const newStatus = statuses[currentIndex];
      setStatus(newStatus);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          user: "Bot",
          message: `Status do jogo: ${newStatus}`,
          reactions: 0,
        },
      ]);
      if (notificationSound && notificationsEnabled) notificationSound.play();
    }, 30000);

    return () => clearInterval(interval);
  }, [notificationsEnabled]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if ((!input.trim() && !file) || !user) return;

    const messageContent = file
      ? {
          id: messages.length + 1,
          user,
          message: replaceEmojis(input),
          file: URL.createObjectURL(file),
          fileType: file.type,
          reactions: 0,
        }
      : {
          id: messages.length + 1,
          user,
          message: replaceEmojis(input),
          reactions: 0,
        };

    setMessages([...messages, messageContent]);
    setInput("");
    setFile(null);
    setPreviewUrl(null);
    if (notificationSound && notificationsEnabled) notificationSound.play();
  };

  const addReaction = (id) => {
    setMessages((msgs) =>
      msgs.map((msg) =>
        msg.id === id ? { ...msg, reactions: msg.reactions + 1 } : msg
      )
    );
  };

  const login = () => {
    const nickname = prompt("Digite seu nome de torcedor:");
    if (nickname) setUser(nickname);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setInput(selected.name);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleVote = (option) => {
    setPoll((prev) => ({
      ...prev,
      votes: { ...prev.votes, [option]: (prev.votes[option] || 0) + 1 }
    }));
  };

  const ranking = useMemo(() => {
    const counts = {};
    messages.forEach(({ user }) => {
      if (!user || user === "Bot") return;
      counts[user] = (counts[user] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center font-sans">
      <h1 className="text-4xl font-extrabold mb-6 text-yellow-400">FURIA Fans Hub 🐍</h1>
      <p className="mb-8 text-lg text-gray-300">Acompanhe e interaja com a torcida em tempo real!</p>

      <div className="w-full max-w-3xl mb-6 rounded-lg overflow-hidden">
        <iframe
          src="https://player.twitch.tv/?channel=furiagg&parent=localhost"
          height="360"
          width="100%"
          allowFullScreen
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>

      <div className="w-full max-w-3xl bg-[#2c2c2c] p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">🔥 Ranking dos Torcedores Ativos 🔥</h2>
        <ul className="space-y-2">
          {ranking.map(([name, count]) => (
            <li key={name} className="flex items-center justify-between text-gray-300">
              <span className="text-xl font-semibold">{name}</span>
              <span>{count} mensagens</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-3xl bg-[#2c2c2c] p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">📊 Enquete da Torcida</h2>
        <p className="text-lg text-gray-300 mb-4">{poll.question}</p>
        <div className="space-y-2">
          {poll.options.map((option) => (
            <button
              key={option}
              onClick={() => handleVote(option)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full text-left"
            >
              {option} ({poll.votes[option] || 0} votos)
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl mb-6">
        <label className="flex items-center gap-3 text-gray-300">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="h-5 w-5 text-yellow-400"
          />
          Ativar notificações sonoras de status
        </label>
      </div>

      {!user && (
        <Button onClick={login} className="mb-4 flex items-center gap-2 px-6 py-2 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition">
          <LogIn size={16} /> Entrar como torcedor
        </Button>
      )}

      <Card className="w-full max-w-3xl bg-[#2c2c2c] rounded-lg shadow-lg p-6">
        <CardContent className="space-y-4">
          <div className="text-sm mb-2 text-green-400">Status do Jogo: {status}</div>
          <ScrollArea className="h-[400px] border rounded p-2 space-y-4" ref={scrollRef}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#333] p-4 rounded-lg shadow-md relative"
              >
                <span className="font-semibold text-purple-400">{msg.user}:</span> {msg.message}
                {msg.file && msg.fileType && msg.fileType.startsWith("image") && (
                  <img src={msg.file} alt="imagem" className="mt-2 rounded-lg max-h-48" />
                )}
                {msg.file && msg.fileType && msg.fileType.startsWith("audio") && (
                  <audio controls className="mt-2 w-full rounded-lg">
                    <source src={msg.file} type={msg.fileType} />
                    Seu navegador não suporta áudio.
                  </audio>
                )}
                {msg.file && msg.fileType && msg.fileType.startsWith("video") && (
                  <video controls className="mt-2 w-full rounded-lg">
                    <source src={msg.file} type={msg.fileType} />
                    Seu navegador não suporta vídeo.
                  </video>
                )}
                <div className="absolute top-2 right-4 flex items-center gap-2 text-yellow-400 cursor-pointer" onClick={() => addReaction(msg.id)}>
                  <ThumbsUp size={16} /> {msg.reactions}
                </div>
              </motion.div>
            ))}
          </ScrollArea>

          {user && (
            <div className="flex gap-4 mt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem ou anexe um arquivo..."
                className="bg-[#333] border-none text-white rounded-lg p-3"
              />
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                <UploadCloud size={16} />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={sendMessage} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg px-6 py-2">
                <Smile size={16} className="mr-1" /> Enviar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-gray-400">
        <p>Referência do Contato Inteligente da FURIA no WhatsApp:</p>
        <a
          href="https://wa.me/5511993404466"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          Clique aqui para conversar com o bot oficial 🔗
        </a>
      </div>
    </div>
  );
}
  