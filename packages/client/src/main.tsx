import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import { RequireAuth, RequireModerator } from "./components/AuthProvider.tsx";
import BookmarkedThreadsPage from "./pages/BookmarkedThreadsPage.tsx";
import BookmarkedToolsPage from "./pages/BookmarkedToolsPage.tsx";
import CommunityNavPage from "./pages/CommunityNavPage.tsx";
import ForbiddenPage from "./pages/ForbiddenPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import MentorshipPage from "./pages/MentorshipPage.tsx";
import ModeratorPage from "./pages/ModeratorPage.tsx";
import PostThreadPage from "./pages/PostThreadPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import SubmitToolReviewsPage from "./pages/SubmitToolReviewsPage.tsx";
import ThreadDetailPage from "./pages/ThreadDetailPage.tsx";
import ThreadsPage from "./pages/ThreadsPage.tsx";
import ToolDetailPage from "./pages/ToolDetailPage.tsx";
import ToolIndexPage from "./pages/ToolIndexPage.tsx";
import ToolSubmissionPage from "./pages/ToolSubmissionPage.tsx";
import VolunteerPage from "./pages/VolunteerPage.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App></App>,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "index",
				element: <ToolIndexPage />,
			},
			{
				path: "tools/:slug",
				element: <ToolDetailPage />,
			},
			{
				path: "login",
				element: <LoginPage />,
			},
			{
				path: "forbidden",
				element: <ForbiddenPage />,
			},
			{
				element: (
					<RequireAuth>
						<Outlet />
					</RequireAuth>
				),
				children: [
					{
						path: "community",
						children: [
							{
								index: true,
								element: <CommunityNavPage />,
							},
							{
								path: "threads",
								element: <ThreadsPage />,
							},
							{
								path: "threads/post",
								element: <PostThreadPage />,
							},
							{
								path: "threads/bookmarked",
								element: <BookmarkedThreadsPage />,
							},
							{
								path: "threads/:id",
								element: <ThreadDetailPage />,
							},
						],
					},
					{
						path: "tools",
						children: [
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
					{
						path: "profile",
						element: <ProfilePage />,
					},
				],
			},
			{
				path: "moderator",
				element: (
					<RequireModerator>
						<ModeratorPage />
					</RequireModerator>
				),
			},
		],
	},
]);

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
