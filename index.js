const core = require('@actions/core')
const axios = require('axios').default
const FormData = require('form-data')
const fs = require('fs')

async function run () {
  try {
    // Get inputs
    const configFile = core.getInput('config_file', { required: true })
    const apiKey = core.getInput('api_key', { required: true })
    const {
      GITHUB_REPOSITORY,
      GITHUB_WORKFLOW,
      GITHUB_ACTION,
      GITHUB_ACTOR,
      GITHUB_SHA
    } = process.env
    const githubMeta = {
      repository: GITHUB_REPOSITORY,
      workflow: GITHUB_WORKFLOW,
      action: GITHUB_ACTION,
      actor: GITHUB_ACTOR,
      sha: GITHUB_SHA
    }

    const form = new FormData()
    form.append('configFile', fs.createReadStream(configFile))
    form.append('apiKey', apiKey)
    form.append('githubMeta', JSON.stringify(githubMeta))

    await axios.post('http://localhost:3050/v1/init', form, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data'
      }
    })
  } catch (error) {
    core.setFailed(error.message)

    const showStackTrace = process.env.SHOW_STACK_TRACE

    if (showStackTrace === 'true') {
      throw error
    }
  }
}

module.exports = run

if (require.main === module) {
  run()
}
