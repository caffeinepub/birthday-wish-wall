import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllWishes, useSubmitWish } from "@/hooks/useQueries";
import {
  Cake,
  Heart,
  Instagram,
  Loader2,
  LogOut,
  Sparkles,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const BIRTHDAY_PERSON = "Your Friend";
const LS_KEY = "birthday_wishes_username";
const LOGIN_PASSWORD = "birthday2024";

const CONFETTI_COLORS = [
  "#F6A23A",
  "#E84E8A",
  "#8A3AB9",
  "#F07D7A",
  "#D86B7D",
  "#F3C55A",
  "#7BC8F6",
];

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  duration: number;
  delay: number;
  size: number;
  shape: string;
}

function useConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const burst = useCallback(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.8,
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? "2px" : "50%",
    }));
    setPieces(newPieces);
    setTimeout(() => setPieces([]), 4000);
  }, []);

  return { pieces, burst };
}

function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  const now = Date.now();
  const diff = now - ms;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

const AVATAR_COLORS = [
  "#F6A23A",
  "#E84E8A",
  "#8A3AB9",
  "#F07D7A",
  "#D86B7D",
  "#7BC8F6",
  "#82D483",
  "#F3C55A",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function BalloonCluster() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-64 flex items-center justify-center select-none pointer-events-none"
    >
      <svg
        aria-hidden="true"
        className="absolute animate-float-slow"
        style={{ left: "20%", top: "10%" }}
        width="70"
        height="90"
        viewBox="0 0 70 90"
      >
        <ellipse cx="35" cy="38" rx="30" ry="35" fill="#F6A23A" opacity="0.9" />
        <ellipse cx="27" cy="24" rx="8" ry="5" fill="white" opacity="0.3" />
        <path
          d="M35 73 Q33 80 35 88"
          stroke="#888"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      <svg
        aria-hidden="true"
        className="absolute animate-float"
        style={{ left: "40%", top: "0%" }}
        width="60"
        height="80"
        viewBox="0 0 60 80"
      >
        <ellipse
          cx="30"
          cy="32"
          rx="26"
          ry="30"
          fill="#E84E8A"
          opacity="0.85"
        />
        <ellipse cx="22" cy="20" rx="7" ry="4" fill="white" opacity="0.3" />
        <path
          d="M30 62 Q28 70 30 78"
          stroke="#888"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      <svg
        aria-hidden="true"
        className="absolute animate-float-slow"
        style={{ right: "15%", top: "5%" }}
        width="50"
        height="70"
        viewBox="0 0 50 70"
      >
        <ellipse cx="25" cy="27" rx="22" ry="25" fill="#8A3AB9" opacity="0.8" />
        <ellipse cx="18" cy="17" rx="6" ry="3.5" fill="white" opacity="0.3" />
        <path
          d="M25 52 Q23 60 25 68"
          stroke="#888"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      <svg
        aria-hidden="true"
        className="absolute animate-float"
        style={{ left: "55%", top: "25%" }}
        width="45"
        height="60"
        viewBox="0 0 45 60"
      >
        <ellipse
          cx="22.5"
          cy="24"
          rx="19"
          ry="22"
          fill="#F07D7A"
          opacity="0.85"
        />
        <ellipse cx="16" cy="15" rx="5" ry="3" fill="white" opacity="0.3" />
        <path
          d="M22.5 46 Q21 53 22.5 58"
          stroke="#888"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      <span
        className="absolute text-2xl animate-float"
        style={{ left: "10%", top: "50%" }}
      >
        🎉
      </span>
      <span
        className="absolute text-xl animate-float-slow"
        style={{ right: "10%", top: "55%" }}
      >
        ⭐
      </span>
      <span
        className="absolute text-lg animate-float"
        style={{ left: "50%", top: "60%" }}
      >
        🎊
      </span>
    </div>
  );
}

function ConfettiOverlay({ pieces }: { pieces: ConfettiPiece[] }) {
  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: p.shape,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function LoginCard({ onLogin }: { onLogin: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim().replace(/^@/, "");
    if (!trimmed) {
      setError("Please enter your Instagram username");
      return;
    }
    // Read actual DOM value to handle browser autofill that may not fire onChange
    const passwordValue = passwordRef.current?.value ?? password;
    if (passwordValue.trim() !== LOGIN_PASSWORD.trim()) {
      setError("Incorrect password");
      return;
    }
    onLogin(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card
        className="shadow-2xl border-0 rounded-3xl overflow-hidden"
        style={{ background: "#FFFDF8" }}
      >
        <CardHeader className="pb-4 pt-8 px-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl ig-gradient flex items-center justify-center shadow-lg">
              <Instagram className="text-white" size={30} />
            </div>
            <CardTitle
              className="text-2xl font-bold text-center"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Login with Instagram
            </CardTitle>
            <p className="text-sm text-center" style={{ color: "#666" }}>
              Enter your username to wish{" "}
              <span className="font-semibold ig-gradient-text">
                {BIRTHDAY_PERSON}
              </span>
              !
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="login-username"
                className="text-sm font-semibold mb-1 block"
                style={{ color: "#444", fontFamily: "Poppins, sans-serif" }}
              >
                Username
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 font-medium"
                  style={{ color: "#888" }}
                  aria-hidden="true"
                >
                  @
                </span>
                <Input
                  id="login-username"
                  data-ocid="login.input"
                  className="pl-7 h-12 rounded-xl border-2 font-medium"
                  style={{
                    borderColor: "#D9D2C3",
                    background: "#FAFAF7",
                    fontFamily: "Poppins, sans-serif",
                  }}
                  placeholder="your_instagram_handle"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  autoComplete="username"
                  autoFocus
                  aria-label="Instagram username"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="text-sm font-semibold mb-1 block"
                style={{ color: "#444", fontFamily: "Poppins, sans-serif" }}
              >
                Password
              </label>
              <Input
                ref={passwordRef}
                id="login-password"
                data-ocid="login.password_input"
                type="password"
                className="h-12 rounded-xl border-2 font-medium"
                style={{
                  borderColor: "#D9D2C3",
                  background: "#FAFAF7",
                  fontFamily: "Poppins, sans-serif",
                }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete="off"
                aria-label="Password"
              />
            </div>
            {error && (
              <p
                data-ocid="login.error_state"
                className="text-sm -mt-1"
                style={{ color: "#E84E8A" }}
                role="alert"
              >
                {error}
              </p>
            )}
            <button
              data-ocid="login.submit_button"
              type="submit"
              className="w-full h-12 rounded-xl text-white font-bold text-base ig-gradient shadow-md hover:opacity-90 transition-opacity"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              🎉 Let's Celebrate!
            </button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WishForm({
  username,
  onSubmitSuccess,
}: { username: string; onSubmitSuccess: () => void }) {
  const [message, setMessage] = useState("");
  const { mutateAsync, isPending } = useSubmitWish();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    try {
      await mutateAsync({ username, message: trimmed });
      setMessage("");
      onSubmitSuccess();
      toast.success("Wish sent! 🎉");
    } catch {
      toast.error("Failed to send wish. Please try again.");
    }
  };

  return (
    <Card
      className="shadow-xl border-0 rounded-3xl overflow-hidden"
      style={{ background: "#FFFDF8" }}
    >
      <CardHeader className="pb-2 pt-7 px-8">
        <CardTitle
          className="text-xl font-bold"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          ✍️ Write Your Birthday Wish
        </CardTitle>
        <p className="text-sm" style={{ color: "#666" }}>
          Wishing{" "}
          <span className="font-semibold ig-gradient-text">
            {BIRTHDAY_PERSON}
          </span>{" "}
          something special?
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="wish-username"
              className="text-sm font-semibold mb-1 block"
              style={{ color: "#444" }}
            >
              Your Instagram
            </label>
            <Input
              id="wish-username"
              value={`@${username}`}
              readOnly
              className="h-10 rounded-xl border-2 bg-muted font-medium cursor-not-allowed"
              style={{
                borderColor: "#D9D2C3",
                fontFamily: "Poppins, sans-serif",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="wish-message"
              className="text-sm font-semibold mb-1 block"
              style={{ color: "#444" }}
            >
              Your Wish 💌
            </label>
            <Textarea
              id="wish-message"
              data-ocid="wish.textarea"
              className="rounded-xl border-2 resize-none font-medium min-h-[110px]"
              style={{
                borderColor: "#D9D2C3",
                background: "#FAFAF7",
                fontFamily: "Poppins, sans-serif",
              }}
              placeholder={`Write something beautiful for ${BIRTHDAY_PERSON}... 🎂`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button
            data-ocid="wish.submit_button"
            type="submit"
            disabled={isPending || !message.trim()}
            className="w-full h-12 rounded-xl text-white font-bold text-base ig-gradient shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {isPending ? <Loader2 className="animate-spin" size={18} /> : null}
            {isPending ? "Sending..." : "Send Wish 🎉"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

function WishCard({
  wish,
  index,
}: {
  wish: { username: string; message: string; timestamp: bigint };
  index: number;
}) {
  const color = getAvatarColor(wish.username);
  const initials = wish.username.slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      data-ocid={`wishes.item.${index + 1}`}
    >
      <Card
        className="shadow-md border-0 rounded-2xl h-full"
        style={{ background: "#FFFDF8" }}
      >
        <CardContent className="p-5 flex flex-col gap-3 h-full">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white shadow">
              <AvatarFallback
                style={{
                  background: color,
                  color: "white",
                  fontWeight: 700,
                  fontFamily: "Poppins",
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p
                className="font-bold text-sm truncate"
                style={{ color: "#111" }}
              >
                @{wish.username}
              </p>
              <p className="text-xs" style={{ color: "#888" }}>
                {formatTime(wish.timestamp)}
              </p>
            </div>
            <Heart size={16} style={{ color: "#E84E8A" }} />
          </div>
          <p
            className="text-sm leading-relaxed flex-1"
            style={{ color: "#444", fontFamily: "Poppins, sans-serif" }}
          >
            {wish.message}
          </p>
          <div className="pt-1 border-t" style={{ borderColor: "#EEE" }}>
            <p className="text-xs font-medium" style={{ color: "#888" }}>
              To:{" "}
              <span className="ig-gradient-text font-bold">
                {BIRTHDAY_PERSON}
              </span>{" "}
              🎂
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WishWall() {
  const { data: wishes, isLoading } = useGetAllWishes();
  const sorted = [...(wishes ?? [])].sort((a, b) =>
    Number(b.timestamp - a.timestamp),
  );

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="text-3xl font-extrabold mb-2"
            style={{ fontFamily: "Poppins, sans-serif", color: "#111" }}
          >
            🎊 Wall of Celebratory Wishes
          </h2>
          <p className="text-base" style={{ color: "#666" }}>
            Everyone sending love to{" "}
            <span className="ig-gradient-text font-bold">
              {BIRTHDAY_PERSON}
            </span>
            !
          </p>
        </div>

        {isLoading && (
          <div
            data-ocid="wishes.loading_state"
            className="flex justify-center py-12"
          >
            <Loader2
              className="animate-spin"
              size={40}
              style={{ color: "#E84E8A" }}
            />
          </div>
        )}

        {!isLoading && sorted.length === 0 && (
          <div data-ocid="wishes.empty_state" className="text-center py-16">
            <div className="text-6xl mb-4">🎈</div>
            <p className="text-lg font-semibold" style={{ color: "#888" }}>
              No wishes yet — be the first!
            </p>
          </div>
        )}

        {sorted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((wish, i) => (
              <WishCard
                key={`${wish.username}-${wish.timestamp}`}
                wish={wish}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Header({
  username,
  onLogout,
}: { username: string | null; onLogout: () => void }) {
  return (
    <header
      className="sticky top-0 z-50 shadow-sm"
      style={{
        background: "oklch(0.898 0.055 82)",
        borderBottom: "1px solid oklch(0.865 0.035 82)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cake size={26} style={{ color: "#E84E8A" }} />
          <span
            className="font-extrabold text-lg"
            style={{ fontFamily: "Poppins, sans-serif", color: "#111" }}
          >
            Birthday Wishes
          </span>
        </div>
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main navigation"
        >
          {["Home", "Wish Wall", "About"].map((item) => (
            <a
              key={item}
              href="/"
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: "#444", fontFamily: "Poppins" }}
              data-ocid="nav.link"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {username ? (
            <>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: "#FFFDF8", border: "1.5px solid #D9D2C3" }}
              >
                <Instagram size={14} style={{ color: "#E84E8A" }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#111", fontFamily: "Poppins" }}
                >
                  @{username}
                </span>
              </div>
              <button
                type="button"
                data-ocid="header.button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                style={{
                  background: "#F3E4C8",
                  color: "#444",
                  fontFamily: "Poppins",
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <a
              href="#login"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold ig-gradient shadow hover:opacity-90 transition-opacity"
              style={{ fontFamily: "Poppins" }}
              data-ocid="header.primary_button"
            >
              <Instagram size={15} />
              Login with Instagram
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

function HeroSection({ onScrollToLogin }: { onScrollToLogin: () => void }) {
  return (
    <section className="pt-16 pb-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
            style={{ background: "#F3E4C8", color: "#8A3AB9" }}
          >
            <Sparkles size={15} /> It's {BIRTHDAY_PERSON}'s Birthday! 🎂
          </div>
          <h1
            className="text-5xl md:text-6xl font-black leading-tight mb-5"
            style={{
              fontFamily: "Poppins, sans-serif",
              color: "#111",
              lineHeight: 1.1,
            }}
          >
            Send Birthday
            <br />
            <span className="ig-gradient-text">Wishes with Love</span>
            <br />
            <span>🎉</span>
          </h1>
          <p
            className="text-lg mb-8 leading-relaxed"
            style={{ color: "#555", fontFamily: "Poppins" }}
          >
            Make someone's special day unforgettable. Login with your Instagram
            username and leave a heartfelt message on the birthday wall!
          </p>
          <button
            type="button"
            data-ocid="hero.primary_button"
            onClick={onScrollToLogin}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white text-base font-bold ig-gradient shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            style={{ fontFamily: "Poppins" }}
          >
            <Instagram size={18} />
            Login & Send Wishes
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <BalloonCluster />
          <div id="login" className="-mt-4">
            <LoginCard
              onLogin={(u) => {
                localStorage.setItem(LS_KEY, u);
                window.location.reload();
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LoggedInView({
  username,
  onWishSent,
}: { username: string; onLogout: () => void; onWishSent: () => void }) {
  return (
    <>
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-semibold"
              style={{ background: "#F3E4C8", color: "#8A3AB9" }}
            >
              <Star size={14} fill="#8A3AB9" /> Logged in as @{username}
            </div>
            <h2
              className="text-3xl font-extrabold mb-2"
              style={{ fontFamily: "Poppins, sans-serif", color: "#111" }}
            >
              Submit Your Birthday Wish 🎂
            </h2>
            <p style={{ color: "#666" }}>
              Share your love for{" "}
              <span className="ig-gradient-text font-bold">
                {BIRTHDAY_PERSON}
              </span>
              !
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <WishForm username={username} onSubmitSuccess={onWishSent} />
            <div className="flex flex-col gap-6">
              <div
                className="rounded-3xl p-8 text-center"
                style={{ background: "#FFF0FA", border: "2px solid #F0C0D8" }}
              >
                <div className="text-5xl mb-3">🎂</div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#111", fontFamily: "Poppins" }}
                >
                  It's {BIRTHDAY_PERSON}'s Birthday!
                </h3>
                <p className="text-sm" style={{ color: "#666" }}>
                  Everyone is coming together to make this day extra special.
                  Add your name to the wall!
                </p>
              </div>
              <BalloonCluster />
            </div>
          </div>
        </div>
      </section>
      <div
        style={{
          background: "oklch(0.93 0.028 82)",
          borderTop: "1px solid oklch(0.865 0.035 82)",
        }}
      >
        <WishWall />
      </div>
    </>
  );
}

export default function App() {
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem(LS_KEY),
  );
  const { pieces, burst } = useConfetti();

  const handleLogout = () => {
    localStorage.removeItem(LS_KEY);
    setUsername(null);
  };

  const scrollToLogin = () => {
    document.getElementById("login")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    document.title = `🎂 ${BIRTHDAY_PERSON}'s Birthday Wishes`;
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "oklch(0.945 0.032 83)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <ConfettiOverlay pieces={pieces} />

      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-20"
          style={{ background: "#F6A23A" }}
        />
        <div
          className="absolute -top-5 -right-8 w-36 h-36 rounded-full opacity-15"
          style={{ background: "#E84E8A" }}
        />
        <div
          className="absolute bottom-20 -left-8 w-32 h-32 rounded-full opacity-15"
          style={{ background: "#8A3AB9" }}
        />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full opacity-10"
          style={{ background: "#F07D7A" }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <Header username={username} onLogout={handleLogout} />

        <main>
          <AnimatePresence mode="wait">
            {!username ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <HeroSection onScrollToLogin={scrollToLogin} />
              </motion.div>
            ) : (
              <motion.div
                key="loggedin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoggedInView
                  username={username}
                  onLogout={handleLogout}
                  onWishSent={burst}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer
          className="mt-12 border-t"
          style={{
            background: "oklch(0.898 0.055 82)",
            borderColor: "oklch(0.865 0.035 82)",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Cake size={22} style={{ color: "#E84E8A" }} />
                  <span
                    className="font-extrabold text-lg"
                    style={{ fontFamily: "Poppins", color: "#111" }}
                  >
                    Birthday Wishes
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#666" }}>
                  The warmest place on the internet to celebrate birthdays
                  together. 🎂
                </p>
              </div>
              <div>
                <h4
                  className="font-bold mb-3 text-sm"
                  style={{ color: "#111" }}
                >
                  Quick Links
                </h4>
                <ul className="flex flex-col gap-2">
                  {["Home", "Submit Wish", "Wish Wall", "About"].map((l) => (
                    <li key={l}>
                      <a
                        href="/"
                        className="text-sm hover:opacity-70 transition-opacity"
                        style={{ color: "#555" }}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4
                  className="font-bold mb-3 text-sm"
                  style={{ color: "#111" }}
                >
                  Follow Us
                </h4>
                <div className="flex gap-3">
                  <a
                    href="/"
                    className="w-9 h-9 rounded-full ig-gradient flex items-center justify-center text-white hover:scale-110 transition-transform"
                    data-ocid="footer.link"
                    aria-label="Instagram"
                  >
                    <Instagram size={16} />
                  </a>
                </div>
              </div>
            </div>
            <div
              className="pt-6 border-t text-center text-sm"
              style={{ borderColor: "oklch(0.865 0.035 82)", color: "#888" }}
            >
              © {new Date().getFullYear()}. Built with{" "}
              <Heart
                size={12}
                className="inline"
                style={{ color: "#E84E8A" }}
              />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                className="font-semibold hover:opacity-80"
                style={{ color: "#8A3AB9" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </footer>
      </div>

      <Toaster richColors position="top-center" />
    </div>
  );
}
