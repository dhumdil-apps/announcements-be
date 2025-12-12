# Deploying to Coolify

This guide covers deploying the Announcements Backend to a self-hosted [Coolify](https://coolify.io/) instance using Cloudflare Tunnels for public access.

## Prerequisites

- A self-hosted Coolify instance
- Cloudflare account with a domain configured
- Cloudflare Tunnel (cloudflared) installed on your server
- Git repository accessible from Coolify (GitHub, GitLab, etc.)

## Step 1: Create New Resource

1. Log in to your Coolify dashboard
2. Select your Server and Project
3. Click **+ Add Resource**
4. Select **Public Repository** or **Private Repository (with GitHub App)**
5. Enter your repository URL

## Step 2: Configure Build Settings

Coolify will auto-detect the Dockerfile. Verify these settings:

| Setting | Value |
|---------|-------|
| Build Pack | Dockerfile |
| Dockerfile Location | `/Dockerfile` |
| Docker Compose Location | Leave empty |

## Step 3: Configure Environment Variables

In the **Environment Variables** section, add:

```
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
DATABASE_PATH=data/announcements.db
DATABASE_SYNC=false
```

**Important:** Set `DATABASE_SYNC=false` in production to prevent accidental schema changes.

## Step 4: Configure Storage (Persistent Volume)

To persist the SQLite database across deployments:

1. Go to **Storages** tab
2. Click **+ Add**
3. Configure the volume:

| Setting | Value |
|---------|-------|
| Name | `announcements-data` |
| Mount Path | `/app/data` |

This ensures the SQLite database survives container restarts and redeployments.

## Step 5: Configure Network

1. Go to **Network** tab
2. Set the **Port** to `3000`
3. Note the internal container hostname/port for Cloudflare Tunnel configuration

Since you're using Cloudflare Tunnels, you won't use Coolify's built-in domain/SSL features. Instead, configure the tunnel to point to your container.

## Step 6: Configure Cloudflare Tunnel

### Option A: Using Cloudflare Dashboard

1. Go to [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) > **Networks** > **Tunnels**
2. Select your tunnel and click **Configure**
3. Add a public hostname:

| Setting | Value |
|---------|-------|
| Subdomain | `api-announcements` (or your choice) |
| Domain | `yourdomain.com` |
| Type | `HTTP` |
| URL | `localhost:3000` or `host.docker.internal:3000` |

4. Under **Additional application settings** > **HTTP Settings**:
   - Enable **WebSockets** for real-time notifications support

### Option B: Using cloudflared config file

Add to your `~/.cloudflared/config.yml`:

```yaml
tunnel: your-tunnel-id
credentials-file: /path/to/credentials.json

ingress:
  - hostname: api-announcements.yourdomain.com
    service: http://localhost:3000
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

Restart cloudflared:
```bash
sudo systemctl restart cloudflared
```

### WebSocket Support

Cloudflare Tunnels support WebSockets by default. Ensure your tunnel configuration doesn't disable them. The Socket.IO connection will work at:
```
wss://api-announcements.yourdomain.com
```

## Step 7: Configure Health Check (Optional)

1. Go to **Health Checks** tab
2. Configure:

| Setting | Value |
|---------|-------|
| Path | `/api/categories` |
| Interval | `30` |
| Timeout | `10` |
| Retries | `3` |

## Step 8: Deploy

1. Click **Deploy** button
2. Monitor the build logs for any errors
3. Once deployed, verify the API is running:

```bash
curl https://api-announcements.yourdomain.com/api/categories
```

## Updating the Application

Coolify supports automatic deployments:

1. **Manual:** Click **Redeploy** in Coolify dashboard
2. **Automatic:** Configure webhook in your Git provider
   - Go to **Webhooks** tab in Coolify
   - Copy the webhook URL
   - Add it to your GitHub/GitLab repository settings

## Troubleshooting

### Database not persisting

Ensure the storage volume is correctly mounted to `/app/data`.

### CORS errors

Verify `CORS_ORIGIN` matches your frontend domain exactly (including protocol).

### WebSocket connection failing

- Ensure WebSockets are enabled in Cloudflare Tunnel settings
- Check that the tunnel is routing to the correct port
- Verify `CORS_ORIGIN` includes your frontend domain

### Container keeps restarting

Check logs in Coolify dashboard. Common issues:
- Missing environment variables
- Database file permissions
- Port conflicts

## Production Checklist

- [ ] `DATABASE_SYNC=false` is set
- [ ] `CORS_ORIGIN` is set to specific frontend domain (not `*`)
- [ ] Persistent storage is configured for `/app/data`
- [ ] HTTPS is enabled
- [ ] Health checks are configured
- [ ] Webhook for automatic deployments is set up
