<template>
  <div style="max-width: 600px; margin: 0 auto">
    <div v-if="checking">
      <cdx-progress-bar />
      <p>{{ $t('checking-blocks') }}</p>
    </div>

    <div v-if="!checking && !ipBlocked && !acctBlocked">
      <div v-if="wgUserName">
        {{ $t('no-blocks-found-logged-in') }}
      </div>
      <div v-else>
        {{ $t('no-blocks-found-logged-out') }}
      </div>

      <div class="uzg-mt20">
        <div v-if="!wgUserName">
          <p>{{ $t('input-username') }}</p>
          <cdx-search-input
            v-model="givenUsername"
            :buttonLabel="$t('search-username')"
            @submit-click="checkGivenUsername"
          ></cdx-search-input>
        </div>
        <p>{{ $t('input-ip') }}</p>
        <cdx-search-input
          v-model="givenIp"
          :buttonLabel="$t('search-ip')"
          @submit-click="checkGivenIp"
        ></cdx-search-input>

        <cdx-message v-if="errorMessage" class="uzg-mt20" type="error">{{ errorMessage }}</cdx-message>
      </div>
    </div>

    <div v-if="!checking && acctBlocked">
      <div>
        {{ $t('account-blocked') }}

        <fieldset>
          <legend>{{ $t('account-blocked-reason') }}</legend>
          <div v-html="acctBlockReasonParsed"></div>
        </fieldset>

        <div v-if="anyAllowUT">
          <div>{{ $t('account-blocked-go-talk') }}</div>

          <div class="uzg-mt20" style="text-align: center">
            <a
              :href="
                getUrl('Special:MyTalk', {
                  action: 'edit',
                  section: 'new',
                  nosummary: 1,
                  preload: 'Template:Blocks_review/preload',
                  'preloadparams[]': acctBlockId,
                })
              "
            >
              <cdx-button type="primary" action="progressive">
                {{ $t('unblock-at-talk') }}
              </cdx-button>
            </a>
          </div>
        </div>
        <div v-else>
          <div>{{ $t('account-blocked-go-mail') }}</div>

          <div>
            <p>{{ $t('unblock-reason') }}</p>
            <textarea v-model="unblockReason" class="cdx-text-input__input" cols="40" rows="5"></textarea>
            <cdx-button class="uzg-mt20" type="primary" action="progressive">
              {{ $t('generate-mail') }}
            </cdx-button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="false">
      <div>
        {{ $t('blocked-action') }}
      </div>

      <div class="uzg-mt20">
        <cdx-radio v-model="blockedAct" name="blocked-action" inputValue="edit">
          {{ $t('blocked-action-edit') }}
        </cdx-radio>
        <cdx-radio v-model="blockedAct" name="blocked-action" inputValue="signup">
          {{ $t('blocked-action-signup') }}
        </cdx-radio>
        <cdx-radio v-model="blockedAct" name="blocked-action" inputValue="login">
          {{ $t('blocked-action-login') }}
        </cdx-radio>
        <cdx-radio v-model="blockedAct" name="blocked-action" inputValue="reset-password">
          {{ $t('blocked-action-reset-password') }}
        </cdx-radio>
        <cdx-radio v-model="blockedAct" name="blocked-action" inputValue="other">
          {{ $t('blocked-action-other') }}
        </cdx-radio>
        <cdx-radio v-model="blockedAct" name="blocked-action" inputValue="not-blocked">
          {{ $t('blocked-action-not-blocked') }}
        </cdx-radio>
      </div>

      <div class="uzg-mt20 uzg-fr">
        <div v-if="blockedAct == 'edit' || blockedAct == 'login' || blockedAct == 'reset-password'">
          <cdx-button type="primary" action="progressive" @click="step = 2">{{ $t('next-step') }}</cdx-button>
        </div>
        <div v-if="blockedAct == 'signup'">
          <cdx-button type="primary" action="progressive" @click="step = 2">{{ $t('next-step') }}</cdx-button>
        </div>
      </div>
    </div>
    <div v-if="false">
      <div v-if="wgUserName">
        <div>
          {{ $t('acct-state-login-ask', [wgUserName]) }}
        </div>

        <div class="uzg-mt20">
          <cdx-radio v-model="acctState" name="acct-state" inputValue="confirm">
            {{ $t('acct-state-confirm') }}
          </cdx-radio>
          <cdx-radio v-model="acctState" name="acct-state" inputValue="not-my-acct">
            {{ $t('acct-state-not-my-acct') }}
          </cdx-radio>
          <cdx-radio v-model="acctState" name="acct-state" inputValue="change">
            {{ $t('acct-state-change') }}
          </cdx-radio>
        </div>
      </div>
      <div v-else>
        <div>
          {{ $t('not-login') }}
        </div>

        <div class="uzg-mt20">
          <cdx-radio v-model="acctState" name="acct-state" inputValue="no-account">
            {{ $t('acct-state-no-account') }}
          </cdx-radio>
          <cdx-radio v-model="acctState" name="acct-state" inputValue="cannot-login">
            {{ $t('acct-state-cannot-login') }}
          </cdx-radio>
        </div>
      </div>

      <div class="uzg-mt20">
        <div v-if="acctState == 'confirm'" class="uzg-fr">
          <cdx-button type="primary" action="progressive" @click="step = 3">{{ $t('next-step') }}</cdx-button>
        </div>
        <div v-else-if="acctState == 'not-my-acct'">
          {{ $t('acct-state-logout') }}
        </div>
        <div v-else-if="acctState == 'change'">
          {{ $t('acct-state-re-login') }}
        </div>
        <div v-else-if="acctState == 'no-account'" class="uzg-fr">
          <cdx-button type="primary" action="progressive" @click="step = 3">{{ $t('next-step') }}</cdx-button>
        </div>
        <div v-else-if="acctState == 'cannot-login'" class="uzg-fr">
          <cdx-button type="primary" action="progressive" @click="step = 2">{{ $t('next-step') }}</cdx-button>
        </div>
      </div>
    </div>

    <div v-if="false">
      <div>
        {{ $t('input-username') }}
        <cdx-search-input
          v-model="givenUsername"
          :buttonLabel="$t('search-username')"
          @submit-click="checkGivenUsername"
        ></cdx-search-input>
      </div>

      <cdx-message v-if="userNameMissing" class="uzg-mt20" type="error">{{
        $t('username-missing', [givenUsername])
      }}</cdx-message>
      <cdx-message v-if="userRegistration" class="uzg-mt20" type="success">{{
        $t('username-found', [normalizedUsername, userRegistration, $t('next-step')])
      }}</cdx-message>

      <div class="uzg-mt20">
        <cdx-button type="normal" action="default" @click="step = 1">{{ $t('prev-step') }}</cdx-button>
        <cdx-button
          v-if="this.normalizedUsername"
          type="primary"
          action="progressive"
          class="uzg-fr"
          @click="step = 3"
          >{{ $t('next-step') }}</cdx-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { CdxButton, CdxRadio, CdxTextInput, CdxSearchInput, CdxMessage, CdxProgressBar } from '@wikimedia/codex'

var api = new mw.Api()

export default {
  name: 'App',
  components: {
    CdxButton,
    CdxRadio,
    CdxTextInput,
    CdxSearchInput,
    CdxMessage,
    CdxProgressBar,
  },
  data: () => ({
    checking: true,
    blockedAct: null,
    acctState: null,
    givenUsername: '',
    givenIp: '',
    errorMessage: '',
    normalizedUsername: '',
    userRegistration: '',
    myIp: '',
    ipAllowUT: true,
    ipBlocked: false,
    ipHardBlock: false,
    ipBlockReason: '',
    acctBlocked: false,
    acctBlockId: null,
    acctHasIpbe: false,
    acctAllowUT: false,
    acctBlockReason: '',
    acctBlockReasonParsed: '',
    unblockReason: '',
  }),
  async created() {
    $('title').text(this.$t('document-title'))
    $('#firstHeading').text(this.$t('heading-title'))
    await this.getMyIp()
    await this.checkIpBlocks(this.myIp)
    if (this.wgUserName) {
      await this.checkAcctBlocks(this.wgUserName)
    }
    this.checking = false
    if (this.ipBlocked || this.acctBlocked) {
      this.step = 3
    } else {
      this.step = 2
    }
    window.vue = this
  },
  computed: {
    wgUserName() {
      return mw.config.get('wgUserName')
    },
    anyAllowUT() {
      if (this.ipBlocked && !this.ipAllowUT) {
        return false
      }
      if (this.acctBlocked && !this.acctAllowUT) {
        return false
      }
      return true
    },
  },
  methods: {
    getUrl: mw.util.getUrl,
    nextStep() {
      this.step += 1
    },
    prevStep() {
      this.step -= 1
    },
    async checkGivenUsername() {
      this.errorMessage = ''
      this.givenUsername = this.givenUsername.trim()
      await this.checkAcctBlocks(this.givenUsername)
      if (this.userNameMissing) {
        this.errorMessage = this.$t('username-missing', [this.normalizedUsername])
      } else if (!this.acctBlocked) {
        this.errorMessage = this.$t('given-acct-not-blocked', [this.normalizedUsername, this.userRegistration])
      }
    },
    async checkGivenIp() {
      this.errorMessage = ''
      this.givenIp = this.givenIp.trim()
      let ok = await this.checkIpBlocks(this.givenIp)
      if (ok) {
        if (!this.ipBlocked) {
          this.errorMessage = this.$t('given-ip-not-blocked')
        }
      } else {
        this.errorMessage = this.$t('bad-ip-or-id')
      }
    },
    async getMyIp() {
      return $.get(mw.util.wikiScript('api'), {
        action: 'query',
        meta: 'userinfo',
        callback: '',
        format: 'json',
        formatversion: '2',
      }).then((data) => {
        if (data.substring(0, 5) === '/**/(') {
          var json = JSON.parse(data.substring(5, data.length - 1))
          if (json && json.query && json.query.userinfo && json.query.userinfo.name && json.query.userinfo.anon) {
            this.myIp = json.query.userinfo.name
          } else {
            console.error('ERROR - malformed API response detected. Response: ', json)
          }
        } else {
          console.error('ERROR - API response had no opening comment. Response: ', data)
        }
      })
    },
    async checkIpBlocks(ip) {
      let info = await this.getIpBlocks(ip)
      if (info === false) {
        return false
      }
      if (info.blocks) {
        for (let i = 0; i < info.blocks.length; i++) {
          const block = info.blocks[i]

          this.ipBlocked = true
          if (!block.anononly) {
            this.ipHardBlock = true
          }
          if (!block.allowusertalk) {
            this.ipAllowUT = false
          }
          this.ipBlockReason += block.reason
        }
      }
      if (info.globalblocks) {
        for (let i = 0; i < info.globalblocks.length; i++) {
          const block = info.globalblocks[i]

          this.ipBlocked = true
          this.ipBlockReason += block.reason
        }
      }
      return true
    },
    async getIpBlocks(ip) {
      let query = {
        action: 'query',
        format: 'json',
        list: 'blocks',
        bkprop: 'by|reason',
      }
      if (mw.util.isIPAddress(ip, true)) {
        query.bkip = ip
        query.list += '|globalblocks'
        query.bgprop = 'by|reason'
        query.bgip = ip
      } else if (/^#\d+$/.test(ip)) {
        query.bkids = ip.substr(1)
      } else {
        return false
      }
      return api.get(query).then((res) => {
        return res.query
      })
    },
    async checkAcctBlocks(username) {
      this.userNameMissing = false
      this.normalizedUsername = ''
      this.userRegistration = ''
      this.acctBlocked = false
      this.acctBlockId = null
      this.acctHasIpbe = false

      let query = await this.getAcctBlocks(username)
      let globaluserinfo = query.globaluserinfo
      let user = query.users[0]
      let block = query.blocks[0]
      if ('missing' in globaluserinfo) {
        this.userNameMissing = true
        this.normalizedUsername = user.name
      } else {
        this.normalizedUsername = globaluserinfo.name
        this.userRegistration = globaluserinfo.registration
      }
      if (block) {
        this.acctBlocked = true
        this.acctBlockId = block.id
        if (block.allowusertalk) {
          this.acctAllowUT = true
        }
        this.acctBlockReason = block.reason
        let parsed = await api.parse(this.acctBlockReason)
        this.acctBlockReasonParsed = parsed
      }
      if ('groupmemberships' in user) {
        for (const row of user.groupmemberships) {
          if (row.group === 'ipblock-exempt') {
            this.acctHasIpbe = true
            break
          }
        }
      }
    },
    async getAcctBlocks(username) {
      return api
        .get({
          action: 'query',
          format: 'json',
          list: 'users|blocks',
          meta: 'globaluserinfo',
          usprop: 'groupmemberships',
          ususers: username,
          bkusers: username,
          bkprop: 'id|by|reason|flags',
          guiuser: username,
        })
        .then(function (res) {
          let user = res.query
          return user
        })
    },
  },
}
</script>

<style>
.uzg-mt20 {
  margin-top: 20px;
}

.uzg-fr {
  float: right;
}
</style>
