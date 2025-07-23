// src/components/layout/Sidebar.jsx
import { NavContent } from "./NavContent";

export default function Sidebar() {
	return (
		// This entire component is hidden on mobile screens (hidden)
		// and shown from medium screens and up (md:flex)
		<aside className="hidden w-64 flex-col border-r bg-card p-4 md:flex">
			<NavContent />
		</aside>
	);
}
