const core = require("@actions/core");
const github = require("@actions/github");
const day = require("dayjs");

async function run() {
	try {
		const inputs = {
			token: core.getInput("token"),
			owner: core.getInput("owner"),
			repository: core.getInput("repository"),
			requiredLabels: core.getInput("required-labels"),
			requiredAssignees: core.getInput("required-assignees"),
			numAssignees: core.getInput("num-assignees"),
			after: core.getInput("after"),
			before: core.getInput("before"),
		};

		const repo = inputs.repository.split("/")[1];

		const requiredLabels = inputs.requiredLabels.split(",");
		const requiredAssignees = inputs.requiredAssignees.split(",");

		const client = github.getOctokit(inputs.token);

		const afterCutoff = day().subtract(inputs.after, "day");
		
		const { data: issues } = await client.rest.issues.listForRepo({
			owner: inputs.owner,
			repo: repo,
			state: "open",
			since: afterCutoff.toISOString()
		});
		core.info(`Found ${issues.length} open issues since ${afterCutoff.toString()}...`);

		const untriagedIssues = [];
		const beforeCutoff = day().subtract(inputs.before, "day");
		issues.forEach(issue => {
			const { labels, assignees } = issue;

			if (new Date(issue.created_at) < beforeCutoff) {
				return;
			}

			const issueLabels = labels.map(label => label.name);
			const issueAssignees = assignees.map(assignee => assignee.login);

			const hasRequiredLabels = requiredLabels.every(requiredLabel => issueLabels.includes(requiredLabel));
			const hasRequiredAssignees = requiredAssignees.every(requiredAssignee => issueAssignees.includes(requiredAssignee));
			const hasNumAssignees = issueAssignees.length >= inputs.numAssignees;

			if (hasRequiredLabels && hasRequiredAssignees && hasNumAssignees) {
				core.info(`Issue #${issue.number} has all required labels and assignees`);
			} else {
				untriagedIssues.push(issue);
				core.warning(`Issue #${issue.number} does not have all required labels and assignees`);
			}
		});
		const outputList = untriagedIssues.map(issue => issue.number);
		core.setOutput("untriaged-issues", outputList);
	} catch(error) {
		core.setFailed(error.message);
	}
}

run();
