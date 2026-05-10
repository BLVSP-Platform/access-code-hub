import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import { RequireAuth } from "./components/AuthProvider.tsx";
import BookmarkedThreadsPage from "./pages/BookmarkedThreadsPage.tsx";
import BookmarkedToolsPage from "./pages/BookmarkedToolsPage.tsx";
import CommunityNavPage from "./pages/CommunityNavPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import MentorshipPage from "./pages/MentorshipPage.tsx";
import PostThreadPage from "./pages/PostThreadPage.tsx";
import SubmitToolReviewsPage from "./pages/SubmitToolReviewsPage.tsx";
import ThreadsPage from "./pages/ThreadsPage.tsx";
import ToolDetailPage from "./pages/ToolDetailPage.tsx";
import ToolIndexMainMenuPage from "./pages/ToolIndexMainMenuPage.tsx";
import ToolIndexPage from "./pages/ToolIndexPage.tsx";
import ToolSubmissionPage from "./pages/ToolSubmissionPage.tsx";
import VolunteerPage from "./pages/VolunteerPage.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App></App>,
		children: [
			{
				path: "login",
				element: <LoginPage />,
			},
			{
				element: (
					<RequireAuth>
						<Outlet />
					</RequireAuth>
				),
				children: [
					{
						index: true,
						element: <HomePage />,
					},
					{
						path: "community",
						children: [
							{
								index: true,
								element: <CommunityNavPage />,
							},
							{
								path: "browsethreads",
								element: <ThreadsPage />,
							},
							{
								path: "postthread",
								element: <PostThreadPage />,
							},
							{
								path: "bookmarkthread",
								element: <BookmarkedThreadsPage />,
							},
						],
					},
					{
						path: "tools",
						children: [
							{
								index: true,
								element: <ToolIndexMainMenuPage />,
							},
							{
								path: "index",
								element: <ToolIndexPage />,
							},
							{
								path: "submit",
								element: <ToolSubmissionPage />,
							},
							{
								path: "review",
								element: <SubmitToolReviewsPage />,
							},
							{
								path: "bookmarked",
								element: <BookmarkedToolsPage />,
							},
						],
					},
					{
						path: "tool/:id",
						element: <ToolDetailPage />,
					},
					{
						path: "index",
						element: <ToolIndexPage />,
					},
					{
						path: "submission",
						element: <ToolSubmissionPage />,
					},
					{
						path: "volunteer",
						element: <VolunteerPage />,
					},
					{
						path: "mentorship",
						element: <MentorshipPage />,
					},
				],
			},
		],
	},
]);

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
