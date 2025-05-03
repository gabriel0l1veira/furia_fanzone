"use client";

import { useState, useEffect, useRef, useMemo, ChangeEvent, MouseEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; 
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion"; 
import { Smile, ThumbsUp, LogIn, UploadCloud } from "lucide-react";
import type { TwitchChannel } from "@/services/twitch"; 

interface Message {
  id: number;
  user: string;
  message: string;
  reactions: number;
  file?: string; 
  fileType?: string; 
}

interface PollOption {
  text: string;
  votes: number;
}

interface Poll {
  question: string;
  options: PollOption[];
}

const mockMessages: Message[] = [
  { id: 1, user: "Torcedor1", message: "GO FURIAAAAA! 🔥", reactions: 0 },
  { id: 2, user: "Torcedor2", message: "Alguém viu o clutch do FalleN? Insano!", reactions: 0 },
  { id: 3, user: "Bot", message: "Jogo contra NAVI começa às 19h - status: AQUECENDO 🔥", reactions: 0 },
];

const customEmojis: Record<string, string> = {
  ":furia:": "🐍",
  ":art:": "🎯",
  ":victory:": "🏆"
};

function replaceEmojis(text: string): string {
  return text.replace(/:\w+:/g, (match) => customEmojis[match] || match);
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("AQUECENDO");
  const [user, setUser] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [poll, setPoll] = useState<Poll>({
    question: "Quem foi o MVP do último jogo?",
    options: [
      { text: "FalleN", votes: 0 },
      { text: "KSCERATO", votes: 0 },
      { text: "yuurih", votes: 0 }
    ]
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [twitchChannelInfo, setTwitchChannelInfo] = useState<TwitchChannel | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio only on client-side
   useEffect(() => {
    if (typeof Audio !== "undefined") {
      notificationSoundRef.current = new Audio("/notification.mp3");
      notificationSoundRef.current.load();
    }
  }, []);


  // Game Status Update Effect
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
          id: Date.now(),
          user: "Bot",
          message: `Status do jogo: ${newStatus}`,
          reactions: 0,
        },
      ]);
      if (notificationSoundRef.current && notificationsEnabled) {
         notificationSoundRef.current.play().catch(error => console.error("Audio play failed:", error));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [status, notificationsEnabled]);

  // Scroll to bottom effect
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);


  const sendMessage = () => {
    if ((!input.trim() && !file) || !user) return;

    let messageContent: Message;

    if (file) {
       const fileUrl = URL.createObjectURL(file);
        messageContent = {
          id: Date.now(),
          user,
          message: replaceEmojis(input),
          file: fileUrl,
          fileType: file.type,
          reactions: 0,
        };
        setFile(null);
        setPreviewUrl(null);
         if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
        messageContent = {
            id: Date.now(),
            user,
            message: replaceEmojis(input),
            reactions: 0,
        };
    }


    setMessages((prev) => [...prev, messageContent]);
    setInput(""); 

    if (notificationSoundRef.current && notificationsEnabled) {
       notificationSoundRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  };

  const addReaction = (id: number) => {
    setMessages((msgs) =>
      msgs.map((msg) =>
        msg.id === id ? { ...msg, reactions: msg.reactions + 1 } : msg
      )
    );
  };

  const login = () => {
    // In a real app, use a modal or dedicated login page
    const nickname = prompt("Digite seu nome de torcedor:");
    if (nickname && nickname.trim()) {
      setUser(nickname.trim());
    } else {
        alert("Nome inválido. Por favor, tente novamente.");
    }
  };

 const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
        setFile(selected);
        
        setInput(selected.name); 
    } else {
        
        if (input === file?.name) { 
            setInput("");
        }
        setFile(null);
        setPreviewUrl(null);
    }
};


  const handleVote = (optionText: string) => {
    setPoll((prev) => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.text === optionText ? { ...opt, votes: opt.votes + 1 } : opt
      )
    }));
    
  };

  const ranking = useMemo(() => {
    const counts: Record<string, number> = {};
    messages.forEach(({ user: msgUser }) => {
      if (!msgUser || msgUser === "Bot") return;
      counts[msgUser] = (counts[msgUser] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, countA], [, countB]) => countB - countA) 
      .slice(0, 5);
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 md:mb-6 text-primary">FURIA Fans Hub 🐍</h1>
      <p className="mb-6 md:mb-8 text-base md:text-lg text-muted-foreground">Acompanhe e interaja com a torcida em tempo real!</p>

      {/* Twitch Embed */}
      <div className="w-full max-w-4xl mb-6 rounded-lg overflow-hidden shadow-lg border border-border">
        <iframe
          src="https://player.twitch.tv/?channel=https://player.twitch.tv/?channel=dubblez&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&quality=auto&volume=0.1&parent=localhost&muted=true" // Mute by default, parent=localhost might need changing for deployment
          height="400" 
          width="100%"
          allowFullScreen
          className="aspect-video"
          title="FURIAgg Twitch Stream"
        ></iframe>
         
      </div>

      {/* Ranking Card */}
      <Card className="w-full max-w-4xl bg-card p-4 md:p-6 rounded-lg shadow-lg mb-6 border border-border">
         <CardContent>
            <h2 className="text-xl font-bold text-primary mb-4">🔥 Ranking dos Torcedores Ativos 🔥</h2>
            {ranking.length > 0 ? (
            <ul className="space-y-2">
              {ranking.map(([name, count], index) => (
                <li key={name} className="flex items-center justify-between text-foreground">
                  <span className="font-semibold text-lg">#{index + 1} {name}</span>
                  <span className="text-muted-foreground">{count} mensagens</span>
                </li>
              ))}
            </ul>
            ) : (
                <p className="text-muted-foreground">Nenhum torcedor ativo ainda. Seja o primeiro a mandar uma mensagem!</p>
            )}
         </CardContent>
      </Card>


     {/* Poll Card */}
      <Card className="w-full max-w-4xl bg-card p-4 md:p-6 rounded-lg shadow-lg mb-6 border border-border">
        <CardContent>
          <h2 className="text-xl font-bold text-cyan-400 mb-4">📊 Enquete da Torcida</h2>
          <p className="text-lg text-muted-foreground mb-4">{poll.question}</p>
          <div className="space-y-2">
            {poll.options.map((option) => (
              <Button
                key={option.text}
                variant="secondary"
                onClick={() => handleVote(option.text)}
                className="w-full justify-start text-left hover:bg-accent"
              >
                {option.text} ({option.votes} votos)
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

        {/* Notification Toggle */}
        <div className="w-full max-w-4xl mb-6 flex items-center space-x-2">
          <Checkbox
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={(checked) => setNotificationsEnabled(checked === true)} // Handle Checkbox change
            aria-label="Ativar notificações sonoras de status"
          />
          <Label htmlFor="notifications" className="text-sm text-muted-foreground">
            Ativar notificações sonoras de status
          </Label>
        </div>


      {/* Login Button */}
      {!user && (
        <Button onClick={login} className="mb-4 flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
          <LogIn size={16} /> Entrar como torcedor
        </Button>
      )}

      

      {/* Chat Card */}
      <Card className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-4 md:p-6 border border-border">
        <CardContent className="space-y-4">
          <div className="text-sm mb-2 text-green-400 font-semibold">Status do Jogo: {status}</div>
           <ScrollArea className="h-[400px] border border-border rounded-lg p-4" ref={scrollAreaRef}>
             <div ref={viewportRef} className="space-y-4"> {/* Added viewportRef here */}
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layout 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    className="bg-secondary p-3 rounded-lg shadow relative"
                  >
                    <span className={`font-semibold ${msg.user === 'Bot' ? 'text-cyan-400' : 'text-purple-400'}`}>{msg.user}:</span>{' '}
                    <span className="whitespace-pre-wrap break-words">{msg.message}</span> {/* Handle line breaks and long words */}
                    {msg.file && msg.fileType?.startsWith("image") && (
                      <img src={msg.file} alt="imagem enviada" className="mt-2 rounded-lg max-h-48 w-auto shadow" loading="lazy"/>
                    )}
                    {msg.file && msg.fileType?.startsWith("audio") && (
                      <audio controls className="mt-2 w-full rounded-lg" src={msg.file}>
                        Seu navegador não suporta áudio.
                      </audio>
                    )}
                    {msg.file && msg.fileType?.startsWith("video") && (
                      <video controls className="mt-2 w-full rounded-lg max-h-60 shadow" src={msg.file}>
                        Seu navegador não suporta vídeo.
                      </video>
                    )}
                     {/* Reaction Button */}
                     {msg.user !== 'Bot' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addReaction(msg.id)}
                            className="absolute top-1 right-1 flex items-center gap-1 text-primary hover:bg-accent px-2 py-1 h-auto"
                            aria-label={`Reagir à mensagem de ${msg.user}`}
                            >
                            <ThumbsUp size={14} />
                            <span className="text-xs">{msg.reactions > 0 ? msg.reactions : ''}</span>
                        </Button>
                     )}
                  </motion.div>
                ))}
              </AnimatePresence>
              </div>
             <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>
      </Card>
      {/* Input area */}
      <div className="w-full max-w-4xl mb-6 rounded-lg overflow-hidden shadow-lg border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress} 
            placeholder="Digite sua mensagem..."
            className="bg-input border-border text-foreground rounded-lg p-3 flex-grow"
            aria-label="Campo de mensagem"
            disabled={!user}
          />
          <Button
            onClick={sendMessage}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-2 sm:px-6 flex items-center justify-center gap-1"
            disabled={!input.trim() || !user} 
          >Enviar</Button>
        </div>
      </div>

       {/* WhatsApp Link */}
      <div className="mt-6 text-center text-muted-foreground text-sm">
        <p>Referência do Contato Inteligente da FURIA no WhatsApp:</p>
        <a
          href="https://wa.me/5511993404466"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Clique aqui para conversar com o bot oficial 🔗
        </a>
      </div>

    </div>
  );
}
