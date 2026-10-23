const WHATSAPP_PATH =
  "M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z";

export function WhatsAppIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} viewBox="0 0 16 16" aria-hidden="true">
      <path d={WHATSAPP_PATH} />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="#2A7F9E" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.17 6.19 19.79 19.79 0 01.08 4.5 2 2 0 012 2.32h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="#E76F51" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function ArrowDownIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function FacebookIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M16 8.05A8 8 0 1 0 6.75 16V10.37H4.72V8.05h2.03V6.28c0-2.01 1.19-3.12 3.01-3.12.87 0 1.78.16 1.78.16v1.96H10.5c-.99 0-1.3.62-1.3 1.25v1.5h2.22l-.35 2.32H9.2V16A8 8 0 0 0 16 8.05z" />
    </svg>
  );
}

export function InstagramIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.44c2.14 0 2.39.01 3.23.05.78.03 1.2.16 1.48.27.37.14.64.32.92.6.28.28.45.54.6.92.11.28.24.7.27 1.48.04.84.05 1.09.05 3.23s-.01 2.39-.05 3.23c-.03.78-.16 1.2-.27 1.48a2.48 2.48 0 0 1-.6.92c-.28.28-.54.45-.92.6-.28.11-.7.24-1.48.27-.84.04-1.09.05-3.23.05s-2.39-.01-3.23-.05c-.78-.03-1.2-.16-1.48-.27a2.48 2.48 0 0 1-.92-.6 2.48 2.48 0 0 1-.6-.92c-.11-.28-.24-.7-.27-1.48C1.45 10.39 1.44 10.14 1.44 8s.01-2.39.05-3.23c.03-.78.16-1.2.27-1.48.14-.37.32-.64.6-.92.28-.28.54-.45.92-.6.28-.11.7-.24 1.48-.27.84-.04 1.09-.05 3.23-.05M8 0C5.83 0 5.56.01 4.7.05c-.86.04-1.45.18-1.96.38a3.93 3.93 0 0 0-1.42.93 3.93 3.93 0 0 0-.93 1.42c-.2.51-.34 1.1-.38 1.96C.01 5.56 0 5.83 0 8s.01 2.44.05 3.3c.04.86.18 1.45.38 1.96.21.53.49.98.93 1.42.44.44.89.72 1.42.93.51.2 1.1.34 1.96.38.86.04 1.13.05 3.3.05s2.44-.01 3.3-.05c.86-.04 1.45-.18 1.96-.38a3.93 3.93 0 0 0 1.42-.93c.44-.44.72-.89.93-1.42.2-.51.34-1.1.38-1.96.04-.86.05-1.13.05-3.3s-.01-2.44-.05-3.3c-.04-.86-.18-1.45-.38-1.96a3.93 3.93 0 0 0-.93-1.42A3.93 3.93 0 0 0 11.26.43c-.51-.2-1.1-.34-1.96-.38C8.44.01 8.17 0 8 0zm0 3.89a4.11 4.11 0 1 0 0 8.22 4.11 4.11 0 0 0 0-8.22zm0 6.78a2.67 2.67 0 1 1 0-5.34 2.67 2.67 0 0 1 0 5.34zm5.23-6.94a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0z" />
    </svg>
  );
}

export function ArrowIcon() {
  // Points to the reading direction; CSS flips it in Arabic.
  return (
    <svg className="arrow-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
