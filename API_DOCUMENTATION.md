# ETS Web API Documentation

This document lists and describes every API endpoint available in the ETS Web platform, including authentication, event sharing, template management, and URL management. All endpoints return JSON responses. Authentication is required for most admin endpoints (JWT via cookies).

---

## Authentication


### POST /api/auth/login
- **Description:** User login. Returns access token (JWT).
- **Request Body:**
```json
{
	"email": "string",
	"password": "string"
}
```
- **Response:**
```json
{
	"accessToken": "string",
	"expires": 1234567890
}
```
- **Auth Required:** No


### POST /api/auth/logout
- **Description:** User logout. Clears session and access token cookies.
- **Request Body:**
```json
{}
```
- **Response:**
```json
{
	"ok": true
}
```
- **Auth Required:** Yes

---

## Event Sharing


### GET /api/share/details
- **Description:** List all share details.
- **Response:**
```json
[
	{
		"id": 1,
		"name": "Event Name",
		"platform": {
			"id": 1,
			"name": "Platform Name"
		},
		"settings": { "key": "value" },
		"createdAt": "2025-11-21T00:00:00Z",
		"updatedAt": "2025-11-21T00:00:00Z"
	}
]
```
- **Auth Required:** Yes


### POST /api/share/details
- **Description:** Create a new share detail.
**Request Body:**
```json
{
	"platform": 1,
	"name": "Event Name",
	"settings": { /* custom settings */ }
}
```
**Response:**
```json
{
	"id": 1,
	"name": "Event Name",
	"platform": {
		"id": 1,
		"name": "Platform Name"
	},
	"settings": { /* custom settings */ },
	"createdAt": "2025-11-21T00:00:00Z",
	"updatedAt": "2025-11-21T00:00:00Z"
}
```
- **Auth Required:** Yes


### GET /api/share/details/[id]
- **Description:** Get detail for a specific share event.
**Response:**
```json
{
	"id": 1,
	"name": "Event Name",
	"platform": {
		"id": 1,
		"name": "Platform Name"
	},
	"settings": { /* custom settings */ },
	"createdAt": "2025-11-21T00:00:00Z",
	"updatedAt": "2025-11-21T00:00:00Z"
}
```
- **Auth Required:** Yes

---


### GET /api/share/platforms
- **Description:** List all share platforms.
- **Response:**
```json
[
	{
		"id": 1,
		"name": "Platform Name"
	}
]
```
- **Auth Required:** Yes


### POST /api/share/platforms
- **Description:** Create a new share platform.
**Request Body:**
```json
{
	"name": "Platform Name"
}
```
**Response:**
```json
{
	"id": 1,
	"name": "Platform Name"
}
```
- **Auth Required:** Yes


### GET /api/share/platforms/[id]
- **Description:** Get details for a specific share platform.
**Response:**
```json
{
	"id": 1,
	"name": "Platform Name"
}
```
- **Auth Required:** Yes

---

## Template Management


### GET /api/template/detail/defaults
- **Description:** Returns all default template JSON configs from `/config/`.
- **Response:**
```json
[
	{
		"id": "1",
		"name": "Template Name",
		"isActive": true,
		"templateType": {
			"id": 1,
			"name": "Type Name"
		},
		"jsonConfig": {
			"settings": {
				"themeColor": "#fff",
				"pageTitle": "Event Page",
				"pageSize": 10,
				"privateGallery": false,
				"pageLogo": "logo.png",
				"customCSS": "",
				"layout": "default",
				"hasAds": false,
				"adbannerLeft": "",
				"adbannerRight": ""
			},
			"content": []
		},
		"createdAt": "2025-11-21T00:00:00Z",
		"updatedAt": "2025-11-21T00:00:00Z"
	}
]
```
- **Auth Required:** No


### GET /api/template/detail
- **Description:** List all template details.
- **Response:**
```json
[
	{
		"id": "1",
		"name": "Template Name",
		"isActive": true,
		"templateType": {
			"id": 1,
			"name": "Type Name"
		},
		"jsonConfig": {
			"settings": {
				"themeColor": "#fff",
				"pageTitle": "Event Page",
				"pageSize": 10,
				"privateGallery": false,
				"pageLogo": "logo.png",
				"customCSS": "",
				"layout": "default",
				"hasAds": false,
				"adbannerLeft": "",
				"adbannerRight": ""
			},
			"content": []
		},
		"createdAt": "2025-11-21T00:00:00Z",
		"updatedAt": "2025-11-21T00:00:00Z"
	}
]
```
- **Auth Required:** Yes


### POST /api/template/detail
- **Description:** Create a new template detail.
**Request Body:**
```json
{
	"templateTypeId": 1,
	"name": "Template Name",
	"isActive": true,
	"jsonConfig": {
		"settings": {
			"themeColor": "#fff",
			"pageTitle": "Event Page",
			"pageSize": 10,
			"privateGallery": false,
			"pageLogo": "logo.png",
			"customCSS": "",
			"layout": "default",
			"hasAds": false,
			"adbannerLeft": "",
			"adbannerRight": ""
		},
		"content": []
	}
}
```
**Response:**
```json
{
	"id": "1",
	"name": "Template Name",
	"isActive": true,
	"templateType": {
		"id": 1,
		"name": "Type Name"
	},
	"jsonConfig": {
		"settings": {
			"themeColor": "#fff",
			"pageTitle": "Event Page",
			"pageSize": 10,
			"privateGallery": false,
			"pageLogo": "logo.png",
			"customCSS": "",
			"layout": "default",
			"hasAds": false,
			"adbannerLeft": "",
			"adbannerRight": ""
		},
		"content": []
	},
	"createdAt": "2025-11-21T00:00:00Z",
	"updatedAt": "2025-11-21T00:00:00Z"
}
```
- **Auth Required:** Yes


### GET /api/template/detail/[id]
- **Description:** Get detail for a specific template.
**Response:**
```json
{
	"id": "1",
	"name": "Template Name",
	"isActive": true,
	"templateType": {
		"id": 1,
		"name": "Type Name"
	},
	"jsonConfig": {
		"settings": {
			"themeColor": "#fff",
			"pageTitle": "Event Page",
			"pageSize": 10,
			"privateGallery": false,
			"pageLogo": "logo.png",
			"customCSS": "",
			"layout": "default",
			"hasAds": false,
			"adbannerLeft": "",
			"adbannerRight": ""
		},
		"content": []
	},
	"createdAt": "2025-11-21T00:00:00Z",
	"updatedAt": "2025-11-21T00:00:00Z"
}
```
- **Auth Required:** Yes

---


### GET /api/template/type
- **Description:** List all template types.
- **Response:**
```json
[
	{
		"id": 1,
		"name": "Type Name"
	}
]
```
- **Auth Required:** Yes


### POST /api/template/type
- **Description:** Create a new template type.
**Request Body:**
```json
{
	"name": "Type Name"
}
```
**Response:**
```json
{
	"id": 1,
	"name": "Type Name"
}
```
- **Auth Required:** Yes


### GET /api/template/type/[id]
- **Description:** Get detail for a specific template type.
**Response:**
```json
{
	"id": 1,
	"name": "Type Name"
}
```
- **Auth Required:** Yes

---

## URL Management


### GET /api/url-manager
- **Description:** List all URL managers.
- **Response:**
```json
[
	{
		"id": 1,
		"uuid": "event-uuid-123",
		"name": "Event URL Name",
		"shareDetails": [
			{
				"id": 1,
				"name": "Event Name",
				"platform": {
					"id": 1,
					"name": "Platform Name"
				},
				"settings": { "key": "value" },
				"createdAt": "2025-11-21T00:00:00Z",
				"updatedAt": "2025-11-21T00:00:00Z"
			}
		],
		"templateDetails": [
			{
				"id": "1",
				"name": "Template Name",
				"isActive": true,
				"templateType": {
					"id": 1,
					"name": "Type Name"
				},
				"jsonConfig": {
					"settings": {
						"themeColor": "#fff",
						"pageTitle": "Event Page",
						"pageSize": 10,
						"privateGallery": false,
						"pageLogo": "logo.png",
						"customCSS": "",
						"layout": "default",
						"hasAds": false,
						"adbannerLeft": "",
						"adbannerRight": ""
					},
					"content": []
				},
				"createdAt": "2025-11-21T00:00:00Z",
				"updatedAt": "2025-11-21T00:00:00Z"
			}
		]
	}
]
```
- **Auth Required:** Yes


### POST /api/url-manager
- **Description:** Create a new URL manager.
**Request Body:**
```json
{
	"name": "Event URL Name",
	"shareDetailIds": [1, 2]
}
```
**Response:**
```json
{
	"id": 1,
	"uuid": "event-uuid-123",
	"name": "Event URL Name",
	"shareDetails": [ /* Array of ShareDetail objects */ ],
	"templateDetails": [ /* Array of TemplateDetail objects */ ]
}
```
- **Auth Required:** Yes


### GET /api/url-manager/[uuid]
- **Description:** Get details for a specific event URL.
**Response:**
```json
{
	"id": 1,
	"uuid": "event-uuid-123",
	"name": "Event URL Name",
	"shareDetails": [ /* Array of ShareDetail objects */ ],
	"templateDetails": [ /* Array of TemplateDetail objects */ ]
}
```
- **Auth Required:** Yes


### PATCH /api/url-manager/[uuid]
- **Description:** Update a specific event URL.
**Request Body:**
```json
{
	"name": "Event URL Name",
	"shareDetailIds": [1, 2]
}
```
**Response:**
```json
{
	"id": 1,
	"uuid": "event-uuid-123",
	"name": "Event URL Name",
	"shareDetails": [ /* Array of ShareDetail objects */ ],
	"templateDetails": [ /* Array of TemplateDetail objects */ ]
}
```
- **Auth Required:** Yes


### DELETE /api/url-manager/[uuid]
- **Description:** Delete a specific event URL.
- **Response:**
```json
{
	"ok": true
}
```
- **Auth Required:** Yes

---

## Assets


### GET /api/assets/...
- **Description:** Direct asset access (images, files, etc.)
- **Response:**
```json
/* File or asset data */
```
- **Auth Required:** No

---

## Type References
- `ShareDetail`, `SharePlatform`, `TemplateDetail`, `TemplateType`, `UrlManager` and their payloads are defined in `lib/types/`.
- All request/response types are strictly validated and documented in the codebase.

---

For request/response examples and type definitions, see the corresponding files in `/app/api/` and `lib/types/`.
