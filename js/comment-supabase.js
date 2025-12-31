// ===== Supabase config ===== 
const supabaseUrl = "https://hrvxyksiguuumjxyyzhb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhydnh5a3NpZ3V1dW1qeHl5emhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxOTAyNDMsImV4cCI6MjA4Mjc2NjI0M30.nvDC3UKWh5wZQbhEBootecBOlZ2V_peWBYKeveirfJE";

const supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// ===== Send comment =====
window.sendComment = async function () {
  const name = document.getElementById("form-name").value.trim();
  const presence = Number(document.getElementById("form-presence").value);
  const message = document.getElementById("form-comment").value.trim();

  if (!name || !message || presence === 0) {
    alert("Điền đầy đủ rồi hãy gửi nha 😅");
    return;
  }

  const { error } = await supabaseClient
    .from("comments")
    .insert([{ name, presence, message }]);

  if (error) {
    console.error(error);
    alert("Gửi lỗi rồi 😭");
    return;
  }

  document.getElementById("form-comment").value = "";
  loadComments();
};

// ===== Load comments =====
window.loadComments = async function () {
  const wrap = document.getElementById("comments");
  if (!wrap) return;

  const { data, error } = await supabaseClient
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  console.log("comments:", data);

  if (error) {
    console.error(error);
    return;
  }

  wrap.innerHTML = "";

  data.forEach(c => {
    wrap.innerHTML += `
      <div class="border rounded-4 p-2 mb-2">
        <b>${c.name}</b>
        <small class="text-muted">
          • ${c.presence == 1 ? "Sẽ đến" : "Không tham dự"}
        </small>
        <p class="m-0">${c.message}</p>
      </div>
    `;
  });
};





document.addEventListener("DOMContentLoaded", loadComments);
