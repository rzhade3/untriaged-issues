# Untriaged Issues

A GitHub Action that will find all issues in your repository that have not been triaged yet.

An issue can be considered untriaged if:

1. It does not have an appropriate assignee; or,
2. It does not have an appropriate label

### Usage

```yaml
      - name: Add comment
        uses: rzhade3/untriaged-issues@main
        with:
          required-labels: "bug,documentation"
          required-assignees: "rzhade3,monalisa"
          num-assignees: 2
          fingerprint: Make sure
          after: 3 # Must have been created less than 3 days ago
          before: 1 # Must have been created over 1 day ago
```

#### Actions Inputs

| Name               | Description                                                                                                                                                           | Default                  |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| token              | GitHub Token with read access to issues                                                                                                                               | `GITHUB_TOKEN`           |
| repository         | Repository to check issues for                                                                                                                                        | current repository       |
| owner              | Owner of repository to check issues for                                                                                                                               | current repository owner |
| required-labels    | Comma separate list of labels that must be present on an issue to be considered triaged.                                                                              |                          |
| required-assignees | Comma-separated list of assignees that must be present on an issue to be considered triaged. If this is set, the issue must have at least one of the assignees listed |                          |
| num-assignees      | Number of assignees that must be present on an issue to be considered triaged                                                                                         |                          |
| after              | Only consider issues updated after this many days ago                                                                                                                 | 7                        |
| before             | Only consider issues that were created before this many day ago                                                                                                       | 1                        |
