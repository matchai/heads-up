<p align="center">
  <h3 align="center">heads-up</h3>
  <p align="center">Uptime monitoring and alerts using GitHub Actions</p>
</p>

---

> ⚠️ This is still very much a work in progress. Expect things to break and change!


## Planned Features

- [x] Website response time
- [x] Statically generated dashboard
  - [ ] Multiple endpoint dashboard
  - [ ] Per-endpoint dashboard
- [ ] Response time metrics
  - [ ] Uptime % (24 hr, 1 week, 1 month, 1 year)
  - [ ] Cumulative downtime duration
- [ ] Downtime alerts
  - [ ] GitHub notification
  - [ ] Email alert
  - [ ] SMS alert
- [ ] Status page
  - [ ] On-page status updates via `repository_dispatch`
- [ ] Update a gist with uptime metrics

## Setup

### Prep work

1. Create a token with the `repo` scope and copy it. (https://github.com/settings/tokens/new)

### Project setup

1. Fork this repo
1. Edit the [environment variable](https://github.com/matchai/waka-box/blob/master/.github/workflows/schedule.yml#L13-L15) in `.github/workflows/schedule.yml`:

   - **url:** The full URL to check for uptime

1. Go to the repo **Settings > Secrets**
1. Add the following environment variables:
   - **access_token:** The GitHub token generated above.
