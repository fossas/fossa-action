# Overview

# Checklist

- [ ] If I changed code, I ran `yarn build` and committed resulting changes.
- [ ] I added an example exercising this PRs functionality to `.github/workflows/test.yml` or explained why it doesn't make sense to do so.

> [!IMPORTANT]
>
> After merging, make sure to create a new GitHub release and associated tag for this release.
> You can either create the tag locally and then create a corresponding GitHub release,
> or just create both the tag and release using the GitHub Release UI.
>
> Additionally, if this is not a breaking change, make sure to update the `v1` tag:
>
> ```shell
> # Check out the tag you want to set as `v1`.
> git checkout $TAG
>
> # Delete and re-create the `v1` tag.
> git tag -d v1 && git push origin :refs/tags/v1 && git tag v1 && git push origin tag v1
> ```
