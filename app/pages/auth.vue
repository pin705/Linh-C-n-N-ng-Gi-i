<template>
  <div class="min-h-screen text-white flex items-center justify-center px-4 overflow-hidden h-full relative">
    <!-- BG -->
    <div
      class="absolute inset-0 bg-cover bg-center opacity-80 z-0"
      style="background-image: url('/background/loader.jpg')"
    />
    <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />

    <!-- Card -->
    <div class="w-full max-w-md space-y-6 p-6 sm:p-8 rounded-2xl shadow-2xl relative z-10 bg-black/80">
      <!-- Tabs -->
      <div
        role="tablist"
        aria-label="Auth tabs"
        class="flex justify-center gap-2 sm:gap-3"
      >
        <button
          :class="['dao-tab', { active: mode === 'login' }]"
          role="tab"
          :aria-selected="mode==='login'"
          @click="switchMode('login')"
        >
          Đăng nhập
        </button>
        <button
          :class="['dao-tab', { active: mode === 'register' }]"
          role="tab"
          :aria-selected="mode==='register'"
          @click="switchMode('register')"
        >
          Đăng ký
        </button>
        <button
          :class="['dao-tab', { active: mode === 'changePassword' }]"
          role="tab"
          :aria-selected="mode==='changePassword'"
          @click="switchMode('changePassword')"
        >
          Đổi mật khẩu
        </button>
      </div>

      <!-- Server Switcher -->
      <!-- <div class="flex items-center justify-center gap-2 sm:gap-3 -mt-2">
        <span class="text-[11px] text-gray-300">Máy chủ:</span>
        <div class="inline-flex rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5 backdrop-blur-sm">
          <button
            :class="['server-pill', selectedServer==='s1' ? 'active' : '']"
            aria-label="Chọn Server S1"
            title="S1 - Máy chủ hiện tại"
            @click="chooseServer('s1')"
          >
            <span class="s-code">S1</span>
            <span class="s-text">
              <span class="s-name">Thiên Môn</span>
              <span class="s-sub">Máy chủ hiện tại</span>
            </span>
          </button>

          <button
            :class="['server-pill', selectedServer==='s2' ? 'active' : '']"
            aria-label="Chọn Server S2"
            title="S2 - s2.mongtutien.online"
            @click="chooseServer('s2')"
          >
            <span class="s-code">S2</span>
            <span class="s-text">
              <span class="s-name">Vân Kiếm</span>
              <span class="s-sub text-green-500 font-semibold">NEW</span>
            </span>
          </button>
        </div>
      </div> -->

      <!-- Quote -->
      <!-- <p class="text-center text-sm italic text-amber-300 animate-glow-text">
        {{ randomQuote }}
      </p> -->

      <!-- Form -->
      <form
        class="space-y-5"
        novalidate
        @submit.prevent="submit"
      >
        <!-- Email -->
        <div>
          <label
            class="block text-sm mb-2 text-gray-300 font-semibold"
            for="email"
          >Danh Hiệu Đạo Đồ (Email)</label>
          <div class="dao-field">
            <input
              id="email"
              v-model.trim="email"
              required
              class="dao-input pl-9"
              type="email"
              inputmode="email"
              autocomplete="email username"
              placeholder="you@example.com"
              :aria-invalid="!isValidEmail && emailTouched ? 'true' : 'false'"
              @blur="emailTouched = true"
            >
          </div>
          <p
            v-if="emailTouched && !isValidEmail"
            class="mt-1 text-xs text-red-300"
          >
            Email chưa hợp lệ.
          </p>
        </div>

        <!-- Old password (change mode) -->
        <div v-if="mode === 'changePassword'">
          <label
            class="block text-sm mb-2 text-gray-300 font-semibold"
            for="oldPassword"
          >Huyền Pháp Cũ</label>
          <div class="dao-field">
            <input
              id="oldPassword"
              v-model="oldPassword"
              required
              class="dao-input pl-9"
              :type="showOldPass ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Nhập huyền pháp cũ"
              @keydown="handleCaps($event)"
            >
            <button
              type="button"
              class="dao-icon-btn"
              :aria-label="showOldPass ? 'Ẩn' : 'Hiện'"
              @click="showOldPass = !showOldPass"
            >
              <svg
                v-if="!showOldPass"
                class="h-4 w-4"
                viewBox="0 0 24 24"
              ><path
                fill="currentColor"
                d="M12 7a5 5 0 0 1 5 5c0 1.07-.34 2.06-.92 2.86l-6.94-6.94C10 7.34 10.93 7 12 7m0-2C7 5 3.73 8.11 2 12c.62 1.41 1.56 2.66 2.7 3.69l-1.41 1.41l1.41 1.41l1.41-1.41C7.34 18.66 9.57 19.91 12 20c5 0 8.27-3.11 10-8c-.66-1.48-1.59-2.78-2.74-3.82l1.41-1.41l-1.41-1.41l-1.41 1.41C16.66 5.34 14.43 4.09 12 4Z"
              /></svg>
              <svg
                v-else
                class="h-4 w-4"
                viewBox="0 0 24 24"
              ><path
                fill="currentColor"
                d="M12 6.5C7 6.5 3.73 9.61 2 13.5c1.73 3.89 5 7 10 7s8.27-3.11 10-7c-1.73-3.89-5-7-10-7m0 11a4 4 0 1 1 0-8a4 4 0 0 1 0 8Z"
              /></svg>
            </button>
          </div>
        </div>

        <!-- Password -->
        <div>
          <label
            class="block text-sm mb-2 text-gray-300 font-semibold"
            :for="mode==='changePassword' ? 'newPassword' : 'password'"
          >
            {{ mode === 'changePassword' ? 'Huyền Pháp Mới' : 'Huyền Pháp Bảo Hộ (Mật Khẩu)' }}
          </label>
          <div class="dao-field">
            <input
              :id="mode==='changePassword' ? 'newPassword' : 'password'"
              v-model="password"
              required
              class="dao-input pl-9 pr-20"
              :type="showPass ? 'text' : 'password'"
              :autocomplete="mode==='register' ? 'new-password' : 'current-password'"
              :placeholder="mode==='changePassword' ? 'Nhập huyền pháp mới' : 'Nhập huyền pháp bảo hộ'"
              @keydown="handleCaps($event)"
              @blur="passwordTouched = true"
            >
            <button
              type="button"
              class="dao-icon-btn right-8"
              :aria-label="showPass ? 'Ẩn' : 'Hiện'"
              @click="showPass = !showPass"
            >
              <svg
                v-if="!showPass"
                class="h-4 w-4"
                viewBox="0 0 24 24"
              ><path
                fill="currentColor"
                d="M12 7a5 5 0 0 1 5 5c0 1.07-.34 2.06-.92 2.86l-6.94-6.94C10 7.34 10.93 7 12 7m0-2C7 5 3.73 8.11 2 12c.62 1.41 1.56 2.66 2.7 3.69l-1.41 1.41l1.41 1.41l1.41-1.41C7.34 18.66 9.57 19.91 12 20c5 0 8.27-3.11 10-8c-.66-1.48-1.59-2.78-2.74-3.82l1.41-1.41l-1.41-1.41l-1.41 1.41C16.66 5.34 14.43 4.09 12 4Z"
              /></svg>
              <svg
                v-else
                class="h-4 w-4"
                viewBox="0 0 24 24"
              ><path
                fill="currentColor"
                d="M12 6.5C7 6.5 3.73 9.61 2 13.5c1.73 3.89 5 7 10 7s8.27-3.11 10-7c-1.73-3.89-5-7-10-7m0 11a4 4 0 1 1 0-8a4 4 0 0 1 0 8Z"
              /></svg>
            </button>
            <span
              v-if="capsOn"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-yellow-300"
            >CapsLock</span>
          </div>

          <!-- strength (register/change only) -->
          <div
            v-if="(mode==='register' || mode==='changePassword') && password"
            class="mt-1"
          >
            <div class="h-1.5 w-full bg-white/10 rounded overflow-hidden">
              <div
                class="h-full"
                :class="strengthBarClass"
                :style="{ width: passwordStrength*25 + '%' }"
              />
            </div>
            <p
              class="text-[11px] mt-1"
              :class="strengthTextClass"
            >
              Độ mạnh: {{ strengthLabel }}
            </p>
          </div>

          <p
            v-if="passwordTouched && !isValidPassword"
            class="mt-1 text-xs text-red-300"
          >
            Mật khẩu tối thiểu 6 ký tự.
          </p>
        </div>

        <!-- Remember email -->
        <div class="flex items-center justify-between text-xs text-gray-300">
          <label class="inline-flex items-center gap-2 select-none">
            <input
              v-model="rememberEmail"
              type="checkbox"
              class="h-3.5 w-3.5 rounded border-white/20 bg-black/50"
            >
            Ghi nhớ email
          </label>
          <span
            v-if="mode==='login'"
            class="text-gray-400 italic"
          >Mật khẩu sẽ được bảo vệ theo phiên.</span>
        </div>

        <!-- CAPTCHA Status -->
        <p
          v-if="captchaStatus"
          class="text-emerald-400 text-xs text-center"
        >
          ✅ {{ captchaStatus }}
        </p>

        <!-- Error / Success -->
        <p
          v-if="error"
          class="text-red-400 text-xs text-center"
        >
          {{ error }}
        </p>
        <p
          v-if="success"
          class="text-emerald-400 text-xs text-center"
        >
          {{ success }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-[url('/decor/ink-brush.png')] bg-center bg-no-repeat bg-cover text-white font-semibold tracking-widest rounded-lg shadow-[0_0_8px_rgba(255,255,255,0.1)] backdrop-blur-sm transition-all duration-300 p-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] hover:brightness-110"
          :disabled="submitting || !canSubmit"
        >
          <span v-if="!submitting">
            {{ mode === 'login'
              ? 'Nhập Định Tu Hành'
              : mode === 'register'
                ? 'Khai Tông Lập Danh'
                : 'Thay Đổi Huyền Pháp' }}
          </span>
          <span
            v-else
            class="inline-flex items-center gap-2"
          >
            <svg
              class="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="3"
                fill="none"
              />
              <path
                class="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v3A5 5 0 0 0 7 12H4z"
              />
            </svg>
            Đang xử lý…
          </span>
        </button>

        <!-- reCAPTCHA legal notice -->
        <div
          v-if="mode === 'register'"
          class="text-[10px] text-gray-400 text-center mt-2"
        >
          This site is protected by reCAPTCHA and the Google
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            class="underline"
          >Privacy Policy</a>
          and
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            class="underline"
          >Terms of Service</a>
          apply.
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
useHead({
  script: [{ src: 'https://www.google.com/recaptcha/api.js?render=6LcuRWorAAAAAC9gdbdvY1Tyh8TL5mqT0ovGyXY7', async: true, defer: true }],
})

const mode = ref('login') // 'login' | 'register' | 'changePassword'
const email = ref('')
const password = ref('')
const oldPassword = ref('')
const error = ref('')
const success = ref('')
const captchaStatus = ref('')
const captchaToken = ref('')
const submitting = ref(false)
const emailTouched = ref(false)
const passwordTouched = ref(false)
const rememberEmail = ref(true)
const capsOn = ref(false)
const showPass = ref(false)
const showOldPass = ref(false)

/* --------- Server switcher --------- */
const selectedServer = ref('s1') // 's1' | 's2'
onMounted(() => {
  // Nhận diện server hiện tại
  const host = window.location.host
  selectedServer.value = host === 's2.mongtutien.online' ? 's2' : 's1'
  // Ghi nhớ email
  const saved = localStorage.getItem('remembered_email')
  if (saved) email.value = saved
  // Quote ngẫu nhiên
  randomQuote.value = quotes[Math.floor(Math.random() * quotes.length)]
})

function chooseServer(key) {
  if (selectedServer.value === key) return
  selectedServer.value = key

  // Chuyển domain khi đổi server
  const path = '/auth'
  if (key === 's2') {
    if (window.location.host !== 's2.mongtutien.online') {
      window.location.href = `https://s2.mongtutien.online${path}`
    }
  }
  else {
    // Về trang gốc của S1 (loại bỏ tiền tố s2. nếu đang ở S2)
    if (window.location.host === 's2.mongtutien.online') {
      window.location.href = `https://mongtutien.online${path}`
    }
    // Nếu đang local/dev hay domain khác thì giữ nguyên (S1 = trang hiện tại)
  }
}
/* ----------------------------------- */

const { fetch, clear } = useUserSession()
const store = useGameStore()

const quotes = [
  '“Thiên địa bất nhân, vạn vật vi sô cẩu. Chỉ có đạo tâm bất diệt, mới có thể nghịch thiên mà hành.”',
  '“Tu hành chi lộ, đầy gian nan hiểm trở. Người quyết tâm mới mong thấy thiên cơ.”',
  '“Mỗi lần nhập định, là một lần thân tâm giao hòa cùng thiên đạo.”',
  '“Đạo đồ khai tông lập phái, nguyện bước chân đầu tiên vững như núi Thái.”',
  '“Chấp niệm sâu dày, huyền pháp tự thông. Kẻ nhập định hôm nay chính là chân tiên ngày sau.”',
  '“Thân nhập hồng trần, tâm hướng thiên đạo. Đó mới là chân tu.”',
  '“Mật pháp chân truyền không dành cho kẻ hồ đồ. Khai mở đạo tâm, để ánh sáng dẫn đường.”',
]
const randomQuote = ref('')

onMounted(() => {
  store.setLoading(false)
  clear()
})

watch(rememberEmail, (v) => {
  if (!v) localStorage.removeItem('remembered_email')
  else if (email.value) localStorage.setItem('remembered_email', email.value)
})
watch(email, (v) => {
  if (rememberEmail.value) localStorage.setItem('remembered_email', v || '')
})

function handleCaps(e) {
  if (typeof e.getModifierState === 'function') {
    capsOn.value = !!e.getModifierState('CapsLock')
  }
}

function switchMode(m) {
  mode.value = m
  // reset feedback
  error.value = ''
  success.value = ''
  captchaStatus.value = ''
  passwordTouched.value = false
  emailTouched.value = false
  // clear mật khẩu nhạy cảm khi đổi mode
  password.value = ''
  oldPassword.value = ''
}

// ===== Validation =====
// const isValidEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
const isValidEmail = computed(() => true)

const isValidPassword = computed(() => (password.value?.length || 0) >= 6)
const canSubmit = computed(() => {
  if (!isValidPassword.value || !isValidEmail.value) return false
  if (mode.value === 'changePassword' && !(oldPassword.value?.length >= 1)) return false
  return true
})

// Password strength (đơn giản)
const passwordStrength = computed(() => {
  // 0..4
  let s = 0
  if (password.value.length >= 6) s++
  if (/[A-Z]/.test(password.value)) s++
  if (/[a-z]/.test(password.value)) s++
  if (/\d/.test(password.value)) s++
  if (/[\W_]/.test(password.value)) s++
  return Math.min(4, s) // map về 0..4
})
const strengthLabel = computed(() => ['Yếu', 'Trung bình', 'Khá', 'Mạnh', 'Rất mạnh'][passwordStrength.value] || 'Yếu')
const strengthBarClass = computed(() => [
  'bg-red-400',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-lime-400',
  'bg-emerald-400',
][passwordStrength.value] || 'bg-red-400')
const strengthTextClass = computed(() => [
  'text-red-300',
  'text-orange-300',
  'text-yellow-300',
  'text-lime-300',
  'text-emerald-300',
][passwordStrength.value] || 'text-red-300')

// reCAPTCHA helper (timeout 5s)
function ensureCaptchaReady(timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const start = performance.now()
    const check = () => {
      if (window.grecaptcha?.execute) return resolve(true)
      if (performance.now() - start > timeoutMs) return reject(new Error('CAPTCHA not ready'))
      requestAnimationFrame(check)
    }
    check()
  })
}

async function submit() {
  error.value = ''
  success.value = ''
  captchaStatus.value = ''
  emailTouched.value = true
  passwordTouched.value = true
  if (!canSubmit.value || submitting.value) return

  try {
    submitting.value = true
    let body = {}
    let endpoint = ''

    if (mode.value === 'changePassword') {
      endpoint = '/api/auth/change-password'
      body = { email: email.value, oldPassword: oldPassword.value, newPassword: password.value }
    }
    else {
      endpoint = mode.value === 'login' ? '/api/auth/login' : '/api/auth/register'
      body = { email: email.value, password: password.value }

      if (mode.value === 'register') {
        try {
          await ensureCaptchaReady()
          captchaToken.value = await grecaptcha.execute('6LcuRWorAAAAAC9gdbdvY1Tyh8TL5mqT0ovGyXY7', { action: 'register' })
          if (!captchaToken.value) throw new Error('no token')
          body.captchaToken = captchaToken.value
          captchaStatus.value = 'Đạo tâm đã được xác thực.'
        }
        catch {
          throw new Error('⚠️ Xác thực CAPTCHA thất bại. Vui lòng thử lại.')
        }
      }
    }

    await $fetch(endpoint, { method: 'POST', body })
    if (mode.value === 'login') {
      await fetch()
      await store.fetchCharacter()
      success.value = 'Đăng nhập thành công.'
      navigateTo('/')
      return
    }

    if (mode.value === 'register') {
      success.value = 'Khai tông lập danh thành công. Mời đạo hữu nhập định tu hành.'
      switchMode('login')
      store.setLoading(false)
      return
    }

    // change password
    success.value = '⚙️ Đã đổi huyền pháp thành công.'
    switchMode('login')
  }
  catch (err) {
    store.setLoading(false)
    const serverMsg = err?.data?.message || err?.message
    error.value
      = mode.value === 'login'
        ? (serverMsg || '⚠️ Danh hiệu hoặc huyền pháp không chính xác.')
        : mode.value === 'register'
          ? (serverMsg || '⚠️ Danh hiệu đạo đồ đã được khai lập hoặc dữ liệu không hợp lệ.')
          : (serverMsg || '⚠️ Huyền pháp cũ không đúng hoặc không tìm thấy tài khoản.')
  }
  finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@keyframes glow-text {
  0%, 100% { text-shadow: 0 0 4px #ffffff; }
  50% { text-shadow: 0 0 10px #10b981; }
}
.animate-glow-text { animation: glow-text 2.5s ease-in-out infinite; }

/* Inputs */
.dao-field { position: relative; }
.dao-icon {
  position: absolute; inset-inline-start: 10px; top: 50%; transform: translateY(-50%);
  color: #c8c8c8; opacity: .8; pointer-events: none;
}
.dao-icon-btn {
  position: absolute; top: 50%; transform: translateY(-50%); inset-inline-end: 10px;
  height: 28px; width: 28px; display: grid; place-items: center;
  border-radius: 6px; color: #dcdcdc; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,.08);
}
.dao-icon-btn:hover { background: rgba(255,255,255,0.12); }

.dao-input {
  width: 100%; padding: 0.6rem 0.6rem; background-color: rgba(20,20,20,.85); border: 1px solid rgba(255,255,255,.1);
  border-radius: 10px; color: white; transition: all .25s ease;
}
.dao-input:focus {
  border-color: #a74625; box-shadow: 0 0 10px #5e1e0b66, inset 0 0 0 9999px rgba(255,255,255,0.01);
  outline: none;
}

/* Tabs */
.dao-tab {
  flex: 1; text-align: center; padding: .5rem .75rem; border-bottom: 2px solid transparent; cursor: pointer;
  font-weight: 700; color: #d1c7b7; transition: all .25s ease; border-radius: 8px;
  background: linear-gradient(to bottom, rgba(255,255,255,.04), rgba(255,255,255,.02));
}
.dao-tab.active { color: #ffc27a; border-color: #5e1e0b; text-shadow: 0 0 4px #5e1e0b77; }
.dao-tab:hover { color: #ffc27a; }

.server-pill{
  display:flex; align-items:center; gap:.5rem; text-align:left;
  padding:.5rem .75rem; color:#d1c7b7; background:rgba(255,255,255,.03);
  transition:all .2s ease; border-right:1px solid rgba(255,255,255,.06);
}
.server-pill:last-child{ border-right:0; }
.server-pill:hover{ background:rgba(255,255,255,.06); }

.server-pill.active{
  background:#fbbf24; color:#111827;
  box-shadow:0 0 18px rgba(251,191,36,.25);
}

.server-pill .s-code{
  display:inline-grid; place-items:center; font-weight:800; font-size:11px;
  width:28px; height:28px; border-radius:9999px;
  background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15);
}
.server-pill.active .s-code{
  background:rgba(0,0,0,.08); border-color:rgba(0,0,0,.15);
}

.server-pill .s-text{ display:flex; flex-direction:column; line-height:1.05; }
.server-pill .s-name{ font-weight:700; font-size:12px; letter-spacing:.2px; }
.server-pill .s-sub{ font-size:10px; opacity:.8; }

@media (max-width: 420px){
  .server-pill{ padding:.45rem .6rem; gap:.45rem; }
  .server-pill .s-code{ width:26px; height:26px; font-size:10px; }
  .server-pill .s-name{ font-size:11.5px; }
  .server-pill .s-sub{ font-size:9.5px; }
}

/* Old styles kept for theme consistency */
.dao-btn {
  background: linear-gradient(to right, #5e1e0b, #7a2d12);
  color: #fff5e1; padding: .35rem; font-weight: bold; border-radius: 6px; transition: all .3s ease;
}
.dao-btn:hover { box-shadow: 0 0 8px #5e1e0baa; background: linear-gradient(to right, #7a2d12, #5e1e0b); }
</style>
