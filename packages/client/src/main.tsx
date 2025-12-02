import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
	createBrowserRouter,
	RouterProvider,
	Outlet,
} from "react-router-dom";
import App from './App.tsx';
import CreatePage from './pages/CreatePage.tsx';
import HomePage from './pages/HomePage.tsx';
import ToolDetailPage from './pages/ToolDetailPage.tsx';
import ToolIndexPage from './pages/ToolIndexPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RequireAuth } from './components/AuthProvider.tsx';
import ToolSubmissionPage from './pages/ToolSubmissionPage.tsx';
import CustomToolSubmissionPage from './pages/CustomToolSubmissionPage.tsx';

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
						path: "createpage",
						element: <CreatePage />,
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
						path: "submission2", // @todo: this should replace submission when backend is completed
						element: <CustomToolSubmissionPage />
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
