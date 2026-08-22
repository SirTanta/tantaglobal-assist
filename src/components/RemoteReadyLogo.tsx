type Props = {
  className?: string;
};

export default function RemoteReadyLogo({ className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "-0.5px", fontFamily: "inherit" }}>RR</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ color: "#ffffff", fontWeight: 800, fontSize: 16, letterSpacing: "-0.3px", fontFamily: "inherit" }}>RemoteReady</span>
        <span style={{ color: "#0d9488", fontWeight: 500, fontSize: 10, marginTop: 2, fontFamily: "inherit" }}>by Tanta Global Academy</span>
      </div>
    </div>
  );
}
