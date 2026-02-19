import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
	createBrowserRouter,
	RouterProvider,
	Outlet,
} from "react-router-dom";
import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import ToolDetailPage from './pages/ToolDetailPage.tsx';
import ToolIndexPage from './pages/ToolIndexPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RequireAuth } from './components/AuthProvider.tsx';
import ToolSubmissionPage from './pages/ToolSubmissionPage.tsx';
import VolunteerPage from './pages/VolunteerPage.tsx';
import ThreadsPage from './pages/ThreadsPage.tsx';
import CommunityNavPage from './pages/CommunityNavPage.tsx';
import PostThreadPage from './pages/PostThreadPage.tsx';
import BookmarkThreadPage from './pages/BookmarkThreadPage.tsx';
import MentorshipPage from './pages/MentorshipPage.tsx';

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
								element: <CommunityNavPage />
							},
							{
								path: "browsethreads",
								element: <ThreadsPage />
							},
							{
								path: "postthread",
								element: <PostThreadPage />
							},
							{
								path: "bookmarkthread",
								element: <BookmarkThreadPage /> 
							},
						]
					},
					{
						path: "tools",
						element: <ToolIndexPage />,
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
						element: <ToolSubmissionPage />
					},
					{
						path: "volunteer",
						element: <VolunteerPage />
					},
					{
						path: "mentorship",
						element: <MentorshipPage />
					},
				],
			},
		],
	},
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
